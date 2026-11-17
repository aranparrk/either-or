package com.eitheror.backend.repository;

import com.eitheror.backend.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query(
            "delete from Comment e where e.poll.pollId = :pollId"
    )
    void deleteAllByPollId(
            @org.springframework.data.repository.query.Param("pollId") Long pollId
    );

    // 기존 특적 투표의 댓글 조회
    List<Comment> findByPoll_PollIdOrderByRegDateAsc(Long pollId);

    // 내가 작성한 댓글 조회
    // 댓글과 해당 댓글이 작성된 투표 정보도 함께 가져오기
    @Query("""
        SELECT c
        FROM Comment c
        JOIN FETCH c.poll
        WHERE c.member.memberId = :memberId
        ORDER BY c.regDate DESC
    """)
    List<Comment> findMyComments(
            @Param("memberId") Long memberId
    );
}

