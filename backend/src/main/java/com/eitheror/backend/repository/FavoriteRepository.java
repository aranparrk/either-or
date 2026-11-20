package com.eitheror.backend.repository;

import com.eitheror.backend.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;

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
}