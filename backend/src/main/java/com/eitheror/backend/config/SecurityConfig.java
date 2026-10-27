package com.eitheror.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class SecurityConfig {

    @Bean
    // 비밀번호를 해시할 수 있는 인코더 객체 생성
    public PasswordEncoder pwdEncoder() {
        return new BCryptPasswordEncoder();
    }

}