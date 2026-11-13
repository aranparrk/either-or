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
        try {
            // JWT에서 로그인한 회원번호 가져오기
            Long memberId = SecurityUtil.currentMemberId();

            // 회원 조회
            Member member = memberRepository.findByMemberId(memberId)
                    .orElseThrow(() -> new IllegalArgumentException(
                            "해당 회원이 존재하지 않습니다:" + memberId
                    ));

            // 비밀번호 변경
            if (dto.getPwd() != null && !dto.getPwd().isBlank()) {
                member.setPwd(pwdEncoder.encode(dto.getPwd()));
            }

            // 프로필을 기본 프로필에서 이미지로 변경할때
            if (dto.getImageUrl() != null && !dto.getImageUrl().isBlank()) {
                member.setImageUrl(dto.getImageUrl());
            }

            // 프로필을 기본 프로필 내에서 변결할때
            else if (dto.getProfileId() != null) {
                member.setProfileId(dto.getProfileId());
                member.setImageUrl(null);
            }

            return true;

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    // 내가 쓴 투표 조회


    // 내가 쓴 댓글 조회


    // 회원탈퇴


    // DTO → Entity

}
