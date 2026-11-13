package com.eitheror.backend.repository;

import com.eitheror.backend.entity.PollOption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PollOptionRepository extends JpaRepository<PollOption, Long> {
    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query("delete from PollOption e where e.poll.pollId = :pollId")
    void deleteAllByPollId(@org.springframework.data.repository.query.Param("pollId") Long pollId);

    List<PollOption> findByPoll_PollId(Long pollId);
}