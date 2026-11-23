package com.eitheror.backend.repository;

import com.eitheror.backend.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository
        extends JpaRepository<Favorite, Long> {

    boolean existsByMember_MemberIdAndPoll_PollId(
            Long memberId,
            Long pollId
    );

    Optional<Favorite> findByMember_MemberIdAndPoll_PollId(
            Long memberId,
            Long pollId
    );

    List<Favorite> findByMember_MemberIdOrderByRegDateDesc(
            Long memberId
    );

    void deleteByMember_MemberIdAndPoll_PollId(
            Long memberId,
            Long pollId
    );

    // 회원 탈퇴시 회원이 누른 즐겨찾기, 회원이 작성한 게시글의 즐겨찾기 삭제
    @Modifying
    @Query("""
        DELETE FROM Favorite f
        WHERE f.member.memberId = :memberId
            OR f.poll.pollId IN (
                SELECT p.pollId
                FROM Poll p
                WHERE p.member.memberId = :memberId
            )
    """)
    void deleteAllByMemberIdForWithdrawal(
            @Param("memberId") Long memberId
    );

}