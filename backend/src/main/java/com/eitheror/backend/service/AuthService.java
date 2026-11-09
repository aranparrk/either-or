package com.eitheror.backend.service;

import com.eitheror.backend.constant.Authority;
import com.eitheror.backend.dto.LoginRequestDto;
import com.eitheror.backend.dto.LoginResponseDto;
import com.eitheror.backend.dto.SignUpRequestDto;
import com.eitheror.backend.dto.TokenDto;
import com.eitheror.backend.entity.Member;
import com.eitheror.backend.repository.MemberRepository;

import com.eitheror.backend.security.TokenProvider;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class AuthService {
    private final MemberRepository memberRepository;
    private final PasswordEncoder pwdEncoder;
    private final TokenProvider tokenProvider;

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

        // 인증에 성공한 회원의 회원번호와 일반 회원 권한으로 JWT 발급
        TokenDto tokenDto = tokenProvider.createToken(
                member.getMemberId(),
                Authority.ROLE_USER
        );

        // 회원 정보와 JWT 반환
        return new LoginResponseDto(
                member.getMemberId(),
                member.getEmail(),
                member.getProfileId(),
                tokenDto.accessToken()
        );
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
