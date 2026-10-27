package com.eitheror.backend.service;

import com.eitheror.backend.dto.PollDetailResDto;
import com.eitheror.backend.dto.VoteCreateReqDto;
import com.eitheror.backend.dto.VoteResDto;
import com.eitheror.backend.entity.Member;
import com.eitheror.backend.entity.Poll;
import com.eitheror.backend.entity.PollOption;
import com.eitheror.backend.entity.Vote;
import com.eitheror.backend.repository.MemberRepository;
import com.eitheror.backend.repository.PollOptionRepository;
import com.eitheror.backend.repository.PollRepository;
import com.eitheror.backend.repository.VoteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class VoteService {
    private final MemberRepository memberRepository;
    private final PollRepository pollRepository;
    private final PollOptionRepository pollOptionRepository;
    private final VoteRepository voteRepository;

    // 투표 참여
    public VoteResDto createVote(Long pollId, VoteCreateReqDto voteCreateReqDto) {
        // 투표 게시물이 있는지 확인
        Optional<Poll> poll = pollRepository.findById(pollId);

        if (poll.isEmpty()) {
            throw new IllegalStateException("해당 투표가 존재하지 않습니다.");
        }

        // 마감된 투표인지 확인
        if (!poll.get().getDeadline().isAfter(LocalDateTime.now())) {
            throw new IllegalArgumentException("마감 된 투표입니다.");
        }

        // 선택지 유효성 검사
        Optional<PollOption> option =
                pollOptionRepository.findById(voteCreateReqDto.getOptionId());

        if (option.isEmpty()) {
            throw new IllegalArgumentException("존재하지 않는 선택지 입니다.");
        }

        if (!option.get().getPoll().getPollId().equals(pollId)) {
            throw new IllegalArgumentException("해당 투표의 선택지가 아닙니다.");
        }

        // 회원 존재 여부 검사
        Optional<Member> member = memberRepository.findById(1L);

        if  (member.isEmpty()) {
            throw new IllegalArgumentException("회원이 존재하지 않습니다.");
        }

        // 중복 투표 검사
        Optional<Vote> vote = voteRepository.findByMember_MemberIdAndPoll_PollId(1L, pollId);

        if (!vote.isEmpty()) {
            throw new IllegalArgumentException("이미 참여한 투표입니다.");
        }

        // 투표 결과 저장
        Vote newVote = new Vote();

        newVote.setMember(member.get());
        newVote.setPoll(poll.get());
        newVote.setPollOption(option.get());

        Vote savedVote = voteRepository.save(newVote);

        return toDto(savedVote);

    }

    public VoteResDto toDto(Vote vote) {
        VoteResDto voteResDto = new VoteResDto();
        voteResDto.setVoteId(vote.getVoteId());
        voteResDto.setPollId(vote.getPoll().getPollId());
        voteResDto.setOptionId(vote.getPollOption().getOptionId());

        return voteResDto;
    }


}
