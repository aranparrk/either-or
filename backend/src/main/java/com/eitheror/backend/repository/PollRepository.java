package com.eitheror.backend.repository;

import com.eitheror.backend.entity.Poll;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PollRepository extends JpaRepository<Poll, Long> {
    @org.springframework.data.jpa.repository.Lock(
            jakarta.persistence.LockModeType.PESSIMISTIC_WRITE
    )
    @org.springframework.data.jpa.repository.Query(
            "select p from Poll p where p.pollId = :id"
    )
    java.util.Optional<Poll> findByIdForUpdate(
            @org.springframework.data.repository.query.Param("id") Long id
    );

    // 내가 작성한 투표를 최신순으로 조회
    List<Poll> findByMember_MemberIdOrderByRegDateDesc(Long memberId);
}
