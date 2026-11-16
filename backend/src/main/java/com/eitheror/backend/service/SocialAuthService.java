
package com.eitheror.backend.service;

import com.eitheror.backend.constant.Authority;
import com.eitheror.backend.constant.SocialProvider;
import com.eitheror.backend.entity.Member;
import com.eitheror.backend.entity.SocialAccount;
import com.eitheror.backend.repository.MemberRepository;
import com.eitheror.backend.repository.SocialAccountRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class SocialAuthService {

    private final MemberRepository memberRepository;
    private final SocialAccountRepository socialAccountRepository;

    // 1. 기존 소셜 회원 조회
    public Optional<Member> findSocialMember(
            SocialProvider provider,
            String providerId
    ) {
        return socialAccountRepository
                .findByProviderAndProviderId(provider, providerId)
                .map(SocialAccount::getMember);
    }

    // 2. 신규 소셜 회원가입
    // provider, providerId는 백엔드가 검증한 인증 정보만 사용
    public Member signUpSocial(
            SocialProvider provider,
            String providerId,
            Integer profileId
    ) {

        // 프로필 선택 확인
        if (profileId == null || profileId < 1 || profileId > 5) {
            throw new IllegalArgumentException(
                    "올바른 프로필을 선택해 주세요."
            );
        }

        // 중복 소셜 가입 확인
        if (findSocialMember(provider, providerId).isPresent()) {
            throw new IllegalStateException(
                    "이미 가입된 소셜 계정입니다."
            );
        }

        // Member 생성
        Member member = new Member();
        member.setProfileId(profileId);
        member.setAuthority(Authority.ROLE_USER);

        // 소셜 전용 회원은 이메일, 비밀번호 없이 저장
        memberRepository.save(member);

        // SocialAccount 생성
        SocialAccount socialAccount = new SocialAccount();
        socialAccount.setMember(member);
        socialAccount.setProvider(provider);
        socialAccount.setProviderId(providerId);

        socialAccountRepository.save(socialAccount);

        log.info("소셜 회원가입 완료: provider={}, memberId={}",
                provider, member.getMemberId());

        return member;
    }
}
