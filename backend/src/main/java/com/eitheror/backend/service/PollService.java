package com.eitheror.backend.service;

import com.eitheror.backend.dto.PollDetailResDto;
import com.eitheror.backend.dto.PollListResDto;
import com.eitheror.backend.dto.PollOptionResDto;
import com.eitheror.backend.entity.Poll;
import com.eitheror.backend.entity.PollOption;
import com.eitheror.backend.repository.PollOptionRepository;
import com.eitheror.backend.repository.PollRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class PollService {
    private final PollRepository pollRepository;
    private final PollOptionRepository pollOptionRepository;

    // 투표 목록 조회
    @Transactional(readOnly = true)
    public List<PollListResDto> getPollList() {
        List<Poll> polls = pollRepository.findAll(Sort.by(Sort.Direction.DESC, "regDate"));
        List<PollListResDto> pollListResDtos = new ArrayList<>();
        for (Poll poll : polls) {
            pollListResDtos.add(toDto(poll));
        }

        return pollListResDtos;
    }

    // 투표 상세 조회
    @Transactional(readOnly = true)
    public PollDetailResDto getPollDetail(Long pollId) {
        Optional<Poll> poll = pollRepository.findById(pollId);
        if (poll.isEmpty()) {
            throw new IllegalArgumentException("해당 투표가 존재하지 않습니다.");
        }
        return toDetailDto(poll.get());
    }

    private PollListResDto toDto(Poll poll) {
        PollListResDto pollListResDto = new PollListResDto();
        pollListResDto.setPollId(poll.getPollId());
        pollListResDto.setTitle(poll.getTitle());
        pollListResDto.setRegDate(poll.getRegDate());
        pollListResDto.setDeadline(poll.getDeadline());
        return pollListResDto;
    }

    private PollDetailResDto toDetailDto(Poll poll) {
        PollDetailResDto pollDetailResDto = new PollDetailResDto();

        pollDetailResDto.setPollId(poll.getPollId());
        pollDetailResDto.setTitle(poll.getTitle());
        pollDetailResDto.setContent(poll.getContent());

        // 해당 게시글에 속한 선택지 조회
        List<PollOption> options =
                pollOptionRepository.findByPoll_PollId(poll.getPollId());

        // Entity → DTO 변환
        List<PollOptionResDto> optionDtos = new ArrayList<>();

        for (PollOption option : options) {
            PollOptionResDto optionDto = new PollOptionResDto();
            optionDto.setOptionId(option.getOptionId());
            optionDto.setContent(option.getContent());
            optionDtos.add(optionDto);
        }

        pollDetailResDto.setOptions(optionDtos);
        pollDetailResDto.setRegDate(poll.getRegDate());
        pollDetailResDto.setDeadline(poll.getDeadline());

        return pollDetailResDto;
    }
}
