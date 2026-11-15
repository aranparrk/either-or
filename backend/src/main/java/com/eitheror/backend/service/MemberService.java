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

        // 프로필을 기본 프로필에서 이미지로 변경
        if (dto.getImageUrl() != null && !dto.getImageUrl().isBlank()) {
            member.setImageUrl(dto.getImageUrl());
            member.setProfileId(null);
        }

        // 프로필을 기본 프로필 내에서 변결
        else if (dto.getProfileId() != null) {

            if (dto.getProfileId() < 1 || dto.getProfileId() > 5) {
                throw new IllegalArgumentException("잘못된 프로필 번호입니다.");
            }

            member.setProfileId(dto.getProfileId());
            member.setImageUrl(null);
        }

        return true;

    }

    // 내가 쓴 투표 조회


    // 내가 쓴 댓글 조회


    // 회원탈퇴


    // DTO → Entity

}
