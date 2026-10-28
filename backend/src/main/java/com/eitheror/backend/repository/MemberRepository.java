package com.eitheror.backend.repository;

import com.eitheror.backend.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {

    // 회원가입 시 존재하는 이메일인지 조회
    boolean existsByEmail(String email);

    // 로그인시 이메일을 가진 회원 조회
    Optional<Member> findByEmail(String email);

}
