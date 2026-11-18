package com.eitheror.backend.repository;

import com.eitheror.backend.constant.SocialProvider;
import com.eitheror.backend.entity.Member;
import com.eitheror.backend.entity.SocialAccount;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface SocialAccountRepository extends CrudRepository<SocialAccount, Long> {

    // 소셜 계정으로 가입한 회원 조회
    Optional<SocialAccount> findByProviderAndProviderId(
            SocialProvider provider,
            String providerId
    );

    // 기존 회원에게 해당 소셜 계정이 연결되어 있는지 조회
    Optional<SocialAccount> findByMemberAndProvider(
            Member member,
            SocialProvider provider
    );

    // 회원과 연결된 소셜 계정 정보 삭제
    void deleteByMember(Member member);
}