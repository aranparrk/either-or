package com.eitheror.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LoginResponseDto {
    // 로그인 응답 DTO
    private long memberId;
    private String email;
    private Integer profileId;
}
