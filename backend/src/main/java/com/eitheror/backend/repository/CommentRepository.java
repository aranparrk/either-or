package com.eitheror.backend.repository;

import com.eitheror.backend.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query("delete from Comment e where e.poll.pollId = :pollId")
    void deleteAllByPollId(@org.springframework.data.repository.query.Param("pollId") Long pollId);

    List<Comment> findByPoll_PollIdOrderByRegDateAsc(Long pollId);
}

