package com.eitheror.backend.security;

import com.eitheror.backend.repository.MemberRepository;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {   // @Component 붙이지 않음 (중복 실행 방지)
    private final TokenProvider tokenProvider;
    private final MemberRepository memberRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {
        String header = req.getHeader(HttpHeaders.AUTHORIZATION);

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);

            if (tokenProvider.validate(token, TokenProvider.ACCESS)) {
                try {
                    Long memberId = tokenProvider.getMemberId(token);
                    
                    // 회원이 존재하는지 조회
                    if (memberRepository.existsById(memberId)) {
                        
                        // 회원이 존재하면 인증 처리
                        SecurityContextHolder.getContext().setAuthentication(
                                tokenProvider.getAuthentication(token)
                        );
                        
                    } else {
                        // 회원이 존재하지 않으면 인증 제거
                        SecurityContextHolder.clearContext();
                    }
                } catch (JwtException | IllegalArgumentException e) {
                    // 토큰 검증 중 오류가 발생하면 인증 실패
                    SecurityContextHolder.clearContext();
                }
            }
        }
        chain.doFilter(req, res);
    }
}