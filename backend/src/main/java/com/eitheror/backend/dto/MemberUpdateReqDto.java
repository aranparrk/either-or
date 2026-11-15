package com.eitheror.backend.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class MemberUpdateReqDto {
    // 회원 정보 수정 요청 DTO
    private String currentPwd; // 기존 비밀번로
    private String newPwd;     // 새 비밀번호
    private String imageUrl;
    private Integer profileId;
}
