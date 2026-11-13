package com.eitheror.backend.config;

import com.eitheror.backend.security.JwtFilter;
import com.eitheror.backend.security.TokenProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    // 비밀번호 해시 처리
    @Bean
    public PasswordEncoder pwdEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    @Profile("dev")
    public SecurityFilterChain filterChain(
            HttpSecurity http,
            TokenProvider tokenProvider
    ) throws Exception {

        http
                // Authorization 헤더로 JWT를 보내는 방식에 맞춰 설정
                .csrf(csrf -> csrf.disable())

                // Spring Security가 로그인 상태를 세션에 저장하지 않도록 설정
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // 기본 로그인 화면과 HTTP Basic 인증 비활성화
                .formLogin(form -> form.disable())
                .httpBasic(basic -> basic.disable())

                // 인증 없이 접근 가능한 주소
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.PUT, "/api/votes/*", "/api/votes/*/comments/*").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/votes/*", "/api/votes/*/comments/*").authenticated()
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/votes",
                                "/api/votes/*/comments",
                                "/api/votes/*/choices"
                        ).authenticated()
                        .requestMatchers(
                                "/swagger-ui.html",
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/api/votes",
                                "/api/votes/**",
                                "/api/auth/**",
                                "/ws",
                                "/error"
                        ).permitAll()
                        .anyRequest().authenticated()
                )

                // 인증되지 않은 사용자가 보호된 API에 접근하면 401 응답
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint((request, response, e) ->
                                response.sendError(401)
                        )
                )

                // JWT 필터 등록
                .addFilterBefore(
                        new JwtFilter(tokenProvider),
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}