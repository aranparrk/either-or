
package com.eitheror.backend.controller;

import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SocialCsrfController {

    // 소셜 회원가입에 사용할 CSRF 토큰 발급
    @GetMapping("/api/auth/social/csrf")
    public CsrfToken getCsrfToken(CsrfToken csrfToken) {
        return csrfToken;
    }
}
