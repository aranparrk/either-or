package com.eitheror.backend.service;

import com.eitheror.backend.dto.VoteCreateReqDto;
import com.eitheror.backend.dto.VoteOptionResultResDto;
import com.eitheror.backend.dto.VoteResDto;
import com.eitheror.backend.dto.VoteResultResDto;
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
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
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
    public VoteResDto createVote(Long pollId, VoteCreateReqDto voteCreateReqDto, long memberId) {
        // 투표 게시물이 있는지 확인
        Optional<Poll> poll = pollRepository.findById(pollId);

        if (poll.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "해당 투표가 존재하지 않습니다."
            );
        }

        // 마감된 투표인지 확인
        if (!poll.get().getDeadline().isAfter(LocalDateTime.now())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "마감된 투표입니다."
            );
        }

        if (voteCreateReqDto.getOptionId() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "선택지 ID를 입력해주세요."
            );
        }

        // 선택지 유효성 검사
        Optional<PollOption> option =
                pollOptionRepository.findById(voteCreateReqDto.getOptionId());

        if (option.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "존재하지 않는 선택지입니다."
            );
        }

        if (!option.get().getPoll().getPollId().equals(pollId)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "해당 투표의 선택지가 아닙니다."
            );
        }

        // 회원 존재 여부 검사
        Optional<Member> member = memberRepository.findById(memberId);

        if (member.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "회원이 존재하지 않습니다."
            );
        }

        // 중복 투표 검사
        Optional<Vote> vote = voteRepository.findByMember_MemberIdAndPoll_PollId(memberId, pollId);

        if (vote.isPresent()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "이미 참여한 투표입니다."
            );
        }

        // 투표 결과 저장
        Vote newVote = new Vote();

        newVote.setMember(member.get());
        newVote.setPoll(poll.get());
        newVote.setPollOption(option.get());

        Vote savedVote = voteRepository.save(newVote);

        return toDto(savedVote);

    }

    // 선택 변경
    public VoteResDto updateVote(Long pollId, VoteCreateReqDto voteCreateReqDto, long memberId) {
        // 투표 게시물이 있는지 확인
        Optional<Poll> poll = pollRepository.findById(pollId);

        if (poll.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "해당 투표가 존재하지 않습니다."
            );
        }

        // 마감된 투표인지 확인
        if (!poll.get().getDeadline().isAfter(LocalDateTime.now())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "마감된 투표입니다."
            );
        }

        if (voteCreateReqDto.getOptionId() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "선택지 ID를 입력해주세요."
            );
        }

        // 선택지 유효성 검사
        Optional<PollOption> option =
                pollOptionRepository.findById(voteCreateReqDto.getOptionId());

        if (option.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "존재하지 않는 선택지입니다."
            );
        }

        if (!option.get().getPoll().getPollId().equals(pollId)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "해당 투표의 선택지가 아닙니다."
            );
        }

        // 회원 존재 여부 검사
        Optional<Member> member = memberRepository.findById(memberId);

        if (member.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "회원이 존재하지 않습니다."
            );
        }

        // 중복 투표 검사
        Optional<Vote> vote = voteRepository.findByMember_MemberIdAndPoll_PollId(memberId, pollId);

        if (vote.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "참여하지 않은 투표입니다."
            );
        }

        Vote updateVote = vote.get();
        updateVote.setPollOption(option.get());

        return toDto(updateVote);
    }

    // 투표 결과 조회
    @Transactional(readOnly = true)
    public VoteResultResDto getVoteResult(Long pollId, Long memberId) {
        Optional<Poll> poll = pollRepository.findById(pollId);
        if (poll.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "해당 투표가 존재하지 않습니다."
            );
        }

        Optional<Vote> vote = voteRepository.findByMember_MemberIdAndPoll_PollId(memberId, pollId);

        if (vote.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "투표에 참여한 적이 없는 사용자입니다."
            );
        }

        long totalVotes = voteRepository.countByPoll_PollId(pollId);

        List<PollOption> pollOptions = pollOptionRepository.findByPoll_PollId(pollId);



        // 선택지별 결과를 담을 리스트
        List<VoteOptionResultResDto> optionResults = new ArrayList<>();

        for (PollOption option : pollOptions) {
            long voteCount = voteRepository.countByPoll_PollIdAndPollOption_OptionId(
                    pollId,
                    option.getOptionId()
            );

            double percentage = totalVotes == 0
                    ? 0.0
                    : (double) voteCount / totalVotes * 100;

            // 현재 선택지의 결과 DTO 생성
            VoteOptionResultResDto optionDto = new VoteOptionResultResDto();

            optionDto.setOptionId(option.getOptionId());
            optionDto.setVoteCount(voteCount);
            optionDto.setPercentage(percentage);

            // 리스트에 추가
            optionResults.add(optionDto);
        }
        // 최종 결과 DTO 생성
        VoteResultResDto resultDto = new VoteResultResDto();

        resultDto.setPollId(pollId);
        resultDto.setTotalVotes(totalVotes);
        resultDto.setOptions(optionResults);

        return resultDto;
    }

    private VoteResDto toDto(Vote vote) {
        VoteResDto voteResDto = new VoteResDto();
        voteResDto.setVoteId(vote.getVoteId());
        voteResDto.setPollId(vote.getPoll().getPollId());
        voteResDto.setOptionId(vote.getPollOption().getOptionId());

        return voteResDto;
    }
}
