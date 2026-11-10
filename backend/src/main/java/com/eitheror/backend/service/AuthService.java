package com.eitheror.backend.service;

import com.eitheror.backend.constant.Authority;
import com.eitheror.backend.dto.LoginRequestDto;
import com.eitheror.backend.dto.LoginResponseDto;
import com.eitheror.backend.dto.SignUpRequestDto;
import com.eitheror.backend.dto.TokenDto;
import com.eitheror.backend.entity.Member;
import com.eitheror.backend.entity.RefreshToken;
import com.eitheror.backend.repository.MemberRepository;

import com.eitheror.backend.repository.RefreshTokenRepository;
import com.eitheror.backend.security.TokenProvider;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class AuthService {
    private final MemberRepository memberRepository;
    private final PasswordEncoder pwdEncoder;
    private final TokenProvider tokenProvider;
    private final RefreshTokenRepository refreshTokenRepository;

    // 이메일 중복 확인
    public boolean memberExist(String email) {
        return memberRepository.existsByEmail(email);
    }

    // 회원가입
    public boolean signUp(SignUpRequestDto dto) {

        // 이메일과 비밀번호 입력 확인
        if (dto.getEmail() == null || dto.getEmail().isBlank()
                || dto.getPwd() == null || dto.getPwd().isBlank()) {
            throw new IllegalArgumentException("이메일과 비밀번호를 입력해 주세요.");
        }

        // 입력된 이메일 앞뒤 공백 제거
        String email = dto.getEmail().trim();

        // 프로필 5지선다 선택 확인
        Integer profileId = dto.getProfileId();
        if (profileId == null || profileId < 1 || profileId > 5) {
            throw new IllegalArgumentException("올바른 프로필을 선택해 주세요.");
        }

        // 가입된 이메일 중복 확인
        if (memberRepository.existsByEmail(email)) {
            return false;
        }

        // DTO → Entity (Member 객체 생성)
        Member member = toEntity(dto, email);

        // 비밀번호 암호화, 그 후 앞서 생성한 member 객체의 비밀번호 칸에 저장
        member.setPwd(pwdEncoder.encode(dto.getPwd()));

        // 전체 회원 정보 DB에 저장
        memberRepository.save(member);

        return true;
    }

    // 로그인
    public LoginResponseDto login(LoginRequestDto dto) {

        // 이메일과 비밀번호 입력 확인
        if (dto.getEmail() == null || dto.getEmail().isBlank()
                || dto.getPwd() == null || dto.getPwd().isBlank()) {
            throw new IllegalArgumentException("이메일과 비밀번호를 입력해 주세요.");
        }

        // 이메일로 회원 조회
        String email = dto.getEmail().trim();
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "이메일 또는 비밀번호가 올바르지 않습니다."
                ));

        // 비밀번호 확인
        if (!pwdEncoder.matches(dto.getPwd(), member.getPwd())) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "이메일 또는 비밀번호가 올바르지 않습니다."
            );
        }

        // 인증에 성공한 회원의 회원번호와 일반 회원 권한으로 Access + Refresh 토큰 발급
        TokenDto tokenDto = tokenProvider.createToken(
                member.getMemberId(),
                member.getAuthority()
        );

        saveRefreshToken(member, tokenDto);

        // 회원 정보와 JWT 반환
        return new LoginResponseDto(
                member.getMemberId(),
                member.getEmail(),
                member.getProfileId(),
                tokenDto.grantType(),
                tokenDto.accessToken(),
                tokenDto.accessTokenExpiresIn(),
                tokenDto.refreshToken(),
                tokenDto.refreshTokenExpiresIn()
        );
    }

    // 유효하지 않은 Refresh Token 예외 처리
    private ResponseStatusException invalidRefresh() {
        return new ResponseStatusException(
                HttpStatus.UNAUTHORIZED,
                "유효하지 않은 Refresh Token입니다."
        );
    }

    // 재발급: Refresh 검증 → DB 값과 비교 → 새 토큰 발급
    @Transactional(noRollbackFor = ResponseStatusException.class)
    public TokenDto reissue(String refreshToken) {

        // 1.서명·만료·종류(refresh) 검증
        if (!tokenProvider.validate(refreshToken, TokenProvider.REFRESH)) {
            throw invalidRefresh();
        }
        // 2.JWT에서 회원 ID 추출
        Long memberId = tokenProvider.getMemberId(refreshToken);

        // 3.회원 ID로 회원 조회
        Member member = memberRepository.findByMemberId(memberId)
                .orElseThrow(this::invalidRefresh);

        // 4.DB에 저장된 Refresh Token 조회
        RefreshToken saved = refreshTokenRepository.findByMember(member)
                .orElseThrow(this::invalidRefresh);

        // 5.DB 토큰과 전달받은 토큰 비교
        if (!saved.getToken().equals(refreshToken)) {

            // 재사용된 Refresh Token 삭제
            refreshTokenRepository.delete(saved);

            log.warn("Refresh Token 재사용 감지 → DB 토큰 삭제: {}", memberId);

            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "토큰 재사용이 감지되어 로그아웃되었습니다. 다시 로그인하세요."
            );
        }

        // 6.새 토큰 발급
        TokenDto newToken = tokenProvider.createToken(
                member.getMemberId(),
                member.getAuthority()
        );

        // 7.DB에 새로운 Refresh Token 저장
        saved.setToken(newToken.refreshToken());
        saved.setExpiresAt(
                toLocalDateTime(newToken.refreshTokenExpiresIn())
        );

        return newToken;
    }

    // 회원당 1개: 있으면 덮어쓰고, 없으면 새로 저장
    private void saveRefreshToken(Member member, TokenDto tokenDto) {

        RefreshToken refreshToken = refreshTokenRepository.findByMember(member)
                .orElseGet(() -> new RefreshToken(member));

        refreshToken.setToken(tokenDto.refreshToken());

        refreshToken.setExpiresAt(
                toLocalDateTime(tokenDto.refreshTokenExpiresIn())
        );

        refreshTokenRepository.save(refreshToken);
    }

    private LocalDateTime toLocalDateTime(long epochMillis) {
        return LocalDateTime.ofInstant(
                Instant.ofEpochMilli(epochMillis),
                ZoneId.systemDefault()
        );
    }

    // 로그아웃: 내 Refresh Token 삭제 → 더 이상 재발급 불가
    public void logout(Long memberId) {
        memberRepository.findByMemberId(memberId)
                .ifPresent(refreshTokenRepository::deleteByMember);
    }


    // DTO → Entity
    private Member toEntity(SignUpRequestDto dto, String email) {
        Member member = new Member();

        member.setEmail(email);
        member.setProfileId(dto.getProfileId());
        // 비밀번호는 signUp()에서 암호화한 후 별도로 설정

        return member;
    }
}
