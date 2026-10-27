package com.eitheror.backend.repository;

import com.eitheror.backend.entity.PollOption;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PollOptionRepository extends JpaRepository<PollOption, Long> {
    List<PollOption> findByPoll_PollId(Long pollId);
}