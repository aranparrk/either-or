package com.eitheror.backend.repository;

import com.eitheror.backend.entity.Poll;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PollRepository extends JpaRepository<Poll, Long> {
    @org.springframework.data.jpa.repository.Lock(jakarta.persistence.LockModeType.PESSIMISTIC_WRITE)
    @org.springframework.data.jpa.repository.Query("select p from Poll p where p.pollId = :id")
    java.util.Optional<Poll> findByIdForUpdate(@org.springframework.data.repository.query.Param("id") Long id);
}
