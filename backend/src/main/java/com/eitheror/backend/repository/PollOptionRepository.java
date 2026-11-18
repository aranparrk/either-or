package com.eitheror.backend.repository;

import com.eitheror.backend.entity.PollOption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PollOptionRepository extends JpaRepository<PollOption, Long> {
    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query("delete from PollOption e where e.poll.pollId = :pollId")
    void deleteAllByPollId(@org.springframework.data.repository.query.Param("pollId") Long pollId);

    List<PollOption> findByPoll_PollId(Long pollId);

    // 회원 탈퇴시 회원이 작성한 게시글의 모든 선택지 삭제
    @Modifying
    @Query("""
        DELETE FROM PollOption po
        WHERE po.poll.pollId IN (
            SELECT p.pollId
            FROM Poll p
            WHERE p.member.memberId = :memberId
        )
    """)
    void deleteAllByMemberIdForWithdrawal(
            @Param("memberId") Long memberId
    );
}