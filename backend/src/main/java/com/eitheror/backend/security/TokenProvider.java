package com.eitheror.backend.security;

import com.eitheror.backend.constant.Authority;
import com.eitheror.backend.dto.TokenDto;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Slf4j
@Component
public class TokenProvider {

    private static final String AUTH_KEY = "auth";
    private static final String TYPE_KEY = "typ";
    public static final String ACCESS = "access";
    public static final String REFRESH = "refresh";

    private final SecretKey key;
    private final long accessExpMs;
    private final long refreshExpMs;

    public TokenProvider(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.access-exp-ms}") long accessExpMs,
            @Value("${jwt.refresh-exp-ms}") long refreshExpMs
    ) {
        this.key = Keys.hmacShaKeyFor(
                Decoders.BASE64.decode(secret)
        );
        this.accessExpMs = accessExpMs;
        this.refreshExpMs = refreshExpMs;
    }

    // 로그인 성공 후 회원번호와과 권한으로 토큰 생성
    public TokenDto createToken(Long memberId, Authority authority) {
        long now = System.currentTimeMillis();
        Date accessExp = new Date(now + accessExpMs);
        Date refreshExp = new Date(now + refreshExpMs);

        String accessToken = Jwts.builder()
                .subject(memberId.toString())
                .claim(AUTH_KEY, authority.name())
                .claim(TYPE_KEY, ACCESS)
                .issuedAt(new Date(now))
                .expiration(accessExp)
                .signWith(key)
                .compact();

        String refreshToken = Jwts.builder()
                .subject(memberId.toString())
                .claim(TYPE_KEY, REFRESH)
                .id(UUID.randomUUID().toString())
                .issuedAt(new Date(now))
                .expiration(refreshExp)
                .signWith(key)
                .compact();

        return new TokenDto(
                "Bearer",
                accessToken, accessExp.getTime(),
                refreshToken, refreshExp.getTime()
        );
    }

    // 서명, 만료 시간, 회원 번호, 권한 토큰 종류 검증
    public boolean validate(String token, String expectedType) {
        try {
            Claims claims = parse(token);

            String subject = claims.getSubject();
            String authority = claims.get(AUTH_KEY, String.class);
            String type = claims.get(TYPE_KEY, String.class);

            if (subject == null || subject.isBlank()) {
                return false;
            }

            Long memberId = Long.valueOf(subject);

            return memberId > 0
                    && claims.getExpiration() != null
                    && expectedType != null
                    && expectedType.equals(type)
                    && (REFRESH.equals(type) || (
                        ACCESS.equals(type)
                            && authority != null
                            && Arrays.stream(Authority.values())
                            .anyMatch(value -> value.name().equals(authority))
                    )
            );

        } catch (ExpiredJwtException e) {
            log.info("만료된 JWT");
        } catch (JwtException | IllegalArgumentException e) {
            log.info("잘못된 JWT");
        }

        return false;
    }

    // 토큰의 subject(memberId) 가져오기
    public Long getMemberId(String token) {
        return Long.valueOf(parse(token).getSubject());
    }

    // 검증된 토큰으로 Spring Security 인증 객체 생성
    public Authentication getAuthentication(String token) {
        Claims claims = parse(token);

        var authorities = List.of(
                new SimpleGrantedAuthority(
                        claims.get(AUTH_KEY, String.class)
                )
        );

        User principal = new User(
                claims.getSubject(),
                "",
                authorities
        );

        return new UsernamePasswordAuthenticationToken(
                principal,
                token,
                authorities
        );
    }

    // 서명과 만료 시간을 검증하면서 토큰 내용 읽기
    private Claims parse(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}