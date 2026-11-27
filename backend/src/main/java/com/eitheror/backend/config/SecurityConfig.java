
package com.eitheror.backend.config;

import com.eitheror.backend.repository.MemberRepository;
import com.eitheror.backend.security.JwtFilter;
import com.eitheror.backend.security.OAuth2LoginSuccessHandler;
import com.eitheror.backend.security.TokenProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
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

    // ==========================================
    // OAuth2 인증 (카카오, 구글)
    // ==========================================
    @Bean
    @Profile("dev")
    @Order(1)
    public SecurityFilterChain oauth2FilterChain(
            HttpSecurity http,
            OAuth2LoginSuccessHandler successHandler
    ) throws Exception {

        http
                // OAuth2 인증 요청 및 콜백 경로만 처리
                .securityMatcher(
                        "/oauth2/**",
                        "/login/oauth2/**",
                        "/api/auth/social/**"
                )

                // OAuth2 인증 과정에서 필요할 때 세션 사용
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                )

                // OAuth2 경로 접근 허용
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll()
                )

                // OAuth2 로그인 활성화
                .oauth2Login(oauth -> oauth
                        .successHandler(successHandler)
                );

        return http.build();
    }

    // ==========================================
    // 기존 JWT 인증
    // ==========================================
    @Bean
    @Profile("dev")
    @Order(2)
    public SecurityFilterChain filterChain(
            HttpSecurity http,
            TokenProvider tokenProvider,
            MemberRepository memberRepository
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
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/votes/*",
                                "/api/votes/*/comments/*"
                        ).authenticated()

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/votes/*",
                                "/api/votes/*/comments/*"
                        ).authenticated()

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/votes",
                                "/api/votes/compare",
                                "/api/votes/*/comments",
                                "/api/votes/*/choices"
                        ).authenticated()

                        .requestMatchers(
                                HttpMethod.PATCH, 
                                "/member/update"
                        ).authenticated()

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/tour-spots/*"
                        ).permitAll()

                        .requestMatchers(
                                "/swagger-ui.html",
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/api/votes",
                                "/api/votes/**",
                                "/api/auth/**",
                                "/api/image/**",
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
                        new JwtFilter(tokenProvider, memberRepository),
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}
