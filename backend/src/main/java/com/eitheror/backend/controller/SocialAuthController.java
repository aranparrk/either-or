
package com.eitheror.backend.controller;

import com.eitheror.backend.dto.LoginResponseDto;
import com.eitheror.backend.dto.PendingSocialLogin;
import com.eitheror.backend.dto.PendingSocialSignup;
import com.eitheror.backend.dto.SocialSignUpRequestDto;
import com.eitheror.backend.entity.Member;
import com.eitheror.backend.service.AuthService;
import com.eitheror.backend.service.SocialAuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;

@Tag(name = "소셜 로그인 API", description = "소셜 로그인")
@RestController
@RequestMapping("/api/auth/social")
@RequiredArgsConstructor
public class SocialAuthController {

    private final SocialAuthService socialAuthService;
    private final AuthService authService;

    // 소셜 회원가입 완료
    @Operation(summary = "소셜 회원가입", description = "소셜로 회원가입 합니다")
    @PostMapping("/signup")
    public LoginResponseDto signUp(
            @RequestBody SocialSignUpRequestDto dto,
            HttpServletRequest request
    ) {

        // 1. 기존 세션 조회 (없으면 생성하지 않음)
        HttpSession session = request.getSession(false);

        if (session == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "소셜 인증이 필요합니다."
            );
        }

        // 2. 카카오·구글 인증 후 저장한 가입 대기 정보 조회
        PendingSocialSignup pending =
                (PendingSocialSignup) session.getAttribute(
                        "PENDING_SOCIAL_SIGNUP"
                );

        if (pending == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "회원가입 대기 정보가 없습니다."
            );
        }

        // 3. 가입 대기 정보 만료 확인
        if (Instant.now().isAfter(pending.expiresAt())) {
            session.removeAttribute("PENDING_SOCIAL_SIGNUP");

            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "소셜 인증이 만료되었습니다."
            );
        }

        // 4. 회원가입 및 소셜 계정 연결
        Member member = socialAuthService.signUpSocial(
                pending.provider(),
                pending.providerId(),
                dto.profileId()
        );

        // 5. 기존 JWT 발급 로직 재사용
        LoginResponseDto response =
                authService.issueLoginTokens(member);

        // 6. 가입 대기 정보 제거
        session.removeAttribute("PENDING_SOCIAL_SIGNUP");

        return response;
    }

    public record SocialLoginRequest(String code) {
    }

    // 일회용 로그인 코드 → JWT 교환
    @Operation(summary = "소셜 로그인", description = "소셜로 로그인 합니다")
    @PostMapping("/login")
    public LoginResponseDto login(
            @RequestBody SocialLoginRequest dto,
            HttpServletRequest request
    ) {
        HttpSession session = request.getSession(false);

        if (session == null || dto.code() == null || dto.code().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "소셜 로그인을 다시 진행해 주세요."
            );
        }

        Long memberId;

        // 동시에 같은 코드를 보내도 한 요청만 사용할 수 있도록 처리
        synchronized (session) {
            PendingSocialLogin pending =
                    (PendingSocialLogin) session.getAttribute(
                            "PENDING_SOCIAL_LOGIN"
                    );

            if (pending == null) {
                throw new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "소셜 로그인을 다시 진행해 주세요."
                );
            }

            // 만료 시각과 같거나 이후라면 사용 불가
            if (!Instant.now().isBefore(pending.expiresAt())) {
                session.removeAttribute("PENDING_SOCIAL_LOGIN");

                throw new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "로그인 코드가 만료되었습니다."
                );
            }

            if (!pending.code().equals(dto.code())) {
                throw new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "유효하지 않은 로그인 코드입니다."
                );
            }

            memberId = pending.memberId();

            // JWT 발급 전에 삭제하여 코드 재사용 방지
            session.removeAttribute("PENDING_SOCIAL_LOGIN");
        }

        return authService.socialLogin(memberId);
    }
}
