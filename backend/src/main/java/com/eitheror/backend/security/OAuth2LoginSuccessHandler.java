
package com.eitheror.backend.security;

import com.eitheror.backend.constant.SocialProvider;
import com.eitheror.backend.dto.PendingSocialLogin;
import com.eitheror.backend.dto.PendingSocialSignup;
import com.eitheror.backend.entity.Member;
import com.eitheror.backend.service.SocialAuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Duration;
import java.time.Instant;
import java.util.Locale;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final SocialAuthService socialAuthService;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException {

        // 1. OAuth2 인증 결과 가져오기
        OAuth2AuthenticationToken oauthToken =
                (OAuth2AuthenticationToken) authentication;

        // 2. 로그인 제공자 확인 (KAKAO 또는 GOOGLE)
        SocialProvider provider = SocialProvider.valueOf(
                oauthToken.getAuthorizedClientRegistrationId()
                        .toUpperCase(Locale.ROOT)
        );

        // 3. 소셜 서비스에서 제공한 사용자 고유 ID
        String providerId = oauthToken.getName();

        // 4. 이미 연결된 소셜 계정인지 조회
        Optional<Member> socialMember = socialAuthService
                .findSocialMember(provider, providerId);

        boolean exists = socialMember.isPresent();

        // 신규 회원이면 소셜 인증 정보를 세션에 임시 저장
        if (!exists) {

            PendingSocialSignup pendingSignup = new PendingSocialSignup(
                    provider,
                    providerId,
                    Instant.now().plus(Duration.ofMinutes(10))
            );

            request.getSession().setAttribute(
                    "PENDING_SOCIAL_SIGNUP",
                    pendingSignup
            );

            log.info("소셜 회원가입 대기 정보 저장 완료: provider={}", provider);
        }

        // 5. 현재는 조회 결과만 확인
        log.info("소셜 인증 성공: provider={}, 기존 계정={}",
                provider, exists);

        // 임시 테스트 응답 (회원가입/JWT 연결 전)
        response.setContentType("text/plain;charset=UTF-8");

        if (exists) {
            String code = UUID.randomUUID().toString();

            PendingSocialLogin pendingLogin = new PendingSocialLogin(
                    code,
                    socialMember.orElseThrow().getMemberId(),
                    Instant.now().plus(Duration.ofSeconds(60))
            );

            request.getSession().setAttribute(
                    "PENDING_SOCIAL_LOGIN",
                    pendingLogin
            );

            // 이전 회원가입 대기 정보가 남아 있으면 제거
            request.getSession().removeAttribute("PENDING_SOCIAL_SIGNUP");

            response.sendRedirect(
                    "http://localhost:5173/oauth/callback?code=" + code
            );
        } else {
            // 신규 회원이면 React 프로필 선택 화면으로 이동
            response.sendRedirect("http://localhost:5173/oauth/signup");
        }
    }
}
