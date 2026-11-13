package com.eitheror.backend.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class MemberUpdateReqDto {
    // 회원 정보 수정 요청 DTO
    private String pwd;
    private String imageUrl;
    private Integer profileId;
}
