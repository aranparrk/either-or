package com.eitheror.backend.service;

import com.eitheror.backend.dto.MemberUpdateReqDto;
import com.eitheror.backend.entity.Member;
import com.eitheror.backend.repository.MemberRepository;
import com.eitheror.backend.security.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder pwdEncoder;

    // 기존 비밀번호 확인
    public boolean checkCurrentPwd(String currentPwd) {

        // 로그인한 회원번호 가져오기
        Long memberId = SecurityUtil.currentMemberId();

        // 회원 조회
        Member member = memberRepository.findByMemberId(memberId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "해당 회원이 존재하지 않습니다."
                ));

        // 기존 비밀번호 일치 여부 확인
        return pwdEncoder.matches(currentPwd, member.getPwd());
    }

    // 회원 정보 수정
    public boolean memberUpdate(MemberUpdateReqDto dto) {

        // JWT에서 로그인한 회원번호 가져오기
        Long memberId = SecurityUtil.currentMemberId();

        // 회원 조회
        Member member = memberRepository.findByMemberId(memberId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "해당 회원이 존재하지 않습니다:" + memberId
                ));

        // 비밀번호 변경
        if (dto.getNewPwd() != null && !dto.getNewPwd().isBlank()) {

            if (dto.getCurrentPwd() == null || dto.getCurrentPwd().isBlank()) {
                throw new IllegalArgumentException("기존 비밀번호를 입력해 주세요.");
            }

            if (!pwdEncoder.matches(dto.getCurrentPwd(), member.getPwd())) {
                throw new IllegalArgumentException("기존 비밀번호가 일치하지 않습니다.");
            }

            member.setPwd(pwdEncoder.encode(dto.getNewPwd()));
        }

        // 프로필 변경
        if (dto.getImageUrl() != null && !dto.getImageUrl().isBlank()) {

            // 이미지로 변경시 이미지 주소만 변경
            member.setImageUrl(dto.getImageUrl());

        } else if (dto.getProfileId() != null) {

            // 기본 프로필 선택 시 업로드 이미지 주소 제거
            member.setProfileId(dto.getProfileId());
            member.setImageUrl(null);

        }

        return true;
    }
}
