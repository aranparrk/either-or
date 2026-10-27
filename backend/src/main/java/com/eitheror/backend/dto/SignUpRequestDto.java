package com.eitheror.backend.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class SignUpRequestDto {
    // 회원가입 요청 DTO
    private String email;
    private String pwd;
    private Integer profileId;
}
