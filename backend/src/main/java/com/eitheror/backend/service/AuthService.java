package com.eitheror.backend.service;

import com.eitheror.backend.dto.SignUpRequestDto;
import com.eitheror.backend.entity.Member;
import com.eitheror.backend.repository.MemberRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class AuthService {
    private final MemberRepository memberRepository;
    private final PasswordEncoder pwdEncoder;

    // 회원가입
    public boolean signUp(SignUpRequestDto dto) {

        // 이메일과 비밀번호 입력 확인
        String email = dto.getEmail();
        String pwd = dto.getPwd();
        if (email == null || email.isBlank()
                || pwd == null || pwd.isBlank()) {
            throw new IllegalArgumentException("이메일과 비밀번호를 입력해 주세요.");
        }

        // 입력된 이메일 앞뒤 공백 제거
        email = email.trim();

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
        Member member = toEntity(dto);

        // 비밀번호 암호화, 그 후 앞서 생성한 member 객체의 비밀번호 칸에 저장
        member.setPwd(pwdEncoder.encode(pwd));

        // 전체 회원 정보 DB에 저장
        memberRepository.save(member);

        return true;
    }

    // DTO → Entity
    private Member toEntity(SignUpRequestDto dto) {
        Member member = new Member();

        member.setEmail(dto.getEmail().trim());
        member.setProfileId(dto.getProfileId());
        // 비밀번호는 signUp()에서 암호화한 후 별도로 설정

        return member;
    }
}
