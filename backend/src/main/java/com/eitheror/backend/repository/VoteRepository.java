
package com.eitheror.backend.repository;

import com.eitheror.backend.entity.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VoteRepository extends JpaRepository<Vote, Long> {

    // 특정 회원의 투표 기록 조회
    Optional<Vote> findByMember_MemberIdAndPoll_PollId(
            Long memberId, Long pollId);

    // 해당 게시글의 전체 투표 수
    long countByPoll_PollId(Long pollId);

    // 특정 선택지의 득표 수
    long countByPoll_PollIdAndPollOption_OptionId(
            Long pollId, Long optionId);
}
