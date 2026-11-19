
package com.eitheror.backend.repository;

import com.eitheror.backend.entity.Vote;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface VoteRepository extends JpaRepository<Vote, Long> {
    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query("delete from Vote e where e.poll.pollId = :pollId")
    void deleteAllByPollId(@org.springframework.data.repository.query.Param("pollId") Long pollId);


    // 특정 회원의 투표 기록 조회
    Optional<Vote> findByMember_MemberIdAndPoll_PollId(
            Long memberId, Long pollId);

    // 해당 게시글의 전체 투표 수
    long countByPoll_PollId(Long pollId);

    // 특정 선택지의 득표 수
    long countByPoll_PollIdAndPollOption_OptionId(
            Long pollId, Long optionId);

    // 회원 탈퇴시 회원이 참여한 모든 투표, 회원이 작성한 게시글에 참여된 모든 투표 삭제
    @Modifying
    @Query("""
        DELETE FROM Vote v
        WHERE v.member.memberId = :memberId
            OR v.poll.pollId IN (
                SELECT p.pollId
                FROM Poll p
                WHERE p.member.memberId = :memberId
            )
    """)
    void deleteAllByMemberIdForWithdrawal(
            @Param("memberId") Long memberId
    );

    @Query("""
    SELECT v.poll.pollId AS pollId, COUNT(v) AS voteCount
    FROM Vote v
    WHERE v.regDate >= :start AND v.regDate < :end
    GROUP BY v.poll.pollId
    ORDER BY COUNT(v) DESC, v.poll.pollId ASC
    """)
    List<WeeklyRankingRow> findWeeklyRanking(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end,
            Pageable pageable
    );

    interface WeeklyRankingRow {
        Long getPollId();
        Long getVoteCount();
    }

    @Query("""
        SELECT MIN(o.optionId) AS optionId, COUNT(v) AS voteCount
        FROM Vote v JOIN v.pollOption o
        WHERE v.regDate >= :start AND v.regDate < :end
          AND o.tourContentId IS NOT NULL AND o.tourContentId <> ''
        GROUP BY o.tourContentId
        ORDER BY COUNT(v) DESC, o.tourContentId ASC
        """)
    List<WeeklyDestinationRow> findWeeklyDestinations(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end,
            Pageable pageable
    );

    interface WeeklyDestinationRow {
        Long getOptionId();
        Long getVoteCount();
    }
}
