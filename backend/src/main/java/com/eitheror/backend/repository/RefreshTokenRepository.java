package com.eitheror.backend.repository;

import com.eitheror.backend.entity.Member;
import com.eitheror.backend.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    // 해당 회원의 Refresh Token이 DB에 있는지 조회
    Optional<RefreshToken> findByMember(Member member);

    // 해당 회원의 Refresh Token 삭제
    void deleteByMember(Member member);

}