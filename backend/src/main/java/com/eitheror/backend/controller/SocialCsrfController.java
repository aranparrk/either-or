
package com.eitheror.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "CSRF 토큰 발급", description = "CSRF 토큰 발급합니다")
@RestController
public class SocialCsrfController {

    // 소셜 회원가입에 사용할 CSRF 토큰 발급
    @Operation(summary = "CSRF 토큰 발급", description = "CSRF 토큰을 발급합니다")
    @GetMapping("/api/auth/social/csrf")
    public CsrfToken getCsrfToken(CsrfToken csrfToken) {
        return csrfToken;
    }
}
