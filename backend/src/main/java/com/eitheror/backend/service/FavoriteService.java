package com.eitheror.backend.service;

import com.eitheror.backend.dto.FavoriteResDto;
import com.eitheror.backend.entity.Favorite;
import com.eitheror.backend.entity.Member;
import com.eitheror.backend.entity.Poll;
import com.eitheror.backend.repository.FavoriteRepository;
import com.eitheror.backend.repository.MemberRepository;
import com.eitheror.backend.repository.PollRepository;
import com.eitheror.backend.repository.VoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final MemberRepository memberRepository;
    private final PollRepository pollRepository;
    private final VoteRepository voteRepository;

    // 즐겨찾기 등록
    public void addFavorite(Long memberId, Long pollId) {

        // 이미 즐겨찾기한 게시글인지 확인
        if (favoriteRepository
                .existsByMember_MemberIdAndPoll_PollId(memberId, pollId)) {
            return;
        }

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "회원을 찾을 수 없습니다."
                ));

        Poll poll = pollRepository.findById(pollId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "투표를 찾을 수 없습니다."
                ));

        favoriteRepository.save(new Favorite(member, poll));
    }

    // 즐겨찾기 취소
    public void removeFavorite(Long memberId, Long pollId) {

        favoriteRepository.deleteByMember_MemberIdAndPoll_PollId(
                memberId,
                pollId
        );
    }

    // 즐겨찾기 여부 확인
    @Transactional(readOnly = true)
    public boolean isFavorite(Long memberId, Long pollId) {

        return favoriteRepository
                .existsByMember_MemberIdAndPoll_PollId(memberId, pollId);
    }

    // 내가 즐겨찾기한 투표 목록
    @Transactional(readOnly = true)
    public List<FavoriteResDto> getMyFavorites(Long memberId) {

        List<Favorite> favorites =
                favoriteRepository
                        .findByMember_MemberIdOrderByRegDateDesc(memberId);

        return favorites.stream().map(favorite -> {

            Poll poll = favorite.getPoll();

            FavoriteResDto dto = new FavoriteResDto();

            dto.setFavoriteId(favorite.getFavoriteId());
            dto.setPollId(poll.getPollId());
            dto.setTitle(poll.getTitle());
            dto.setRegDate(favorite.getRegDate());
            dto.setDeadline(poll.getDeadline());

            dto.setTotalVotes(
                    voteRepository.countByPoll_PollId(poll.getPollId())
            );

            return dto;

        }).toList();
    }
}