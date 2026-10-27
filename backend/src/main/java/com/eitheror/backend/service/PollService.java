
package com.eitheror.backend.service;

import com.eitheror.backend.dto.*;
import com.eitheror.backend.entity.Member;
import com.eitheror.backend.entity.Poll;
import com.eitheror.backend.entity.PollOption;
import com.eitheror.backend.repository.MemberRepository;
import com.eitheror.backend.repository.PollOptionRepository;
import com.eitheror.backend.repository.PollRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
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
public class PollService {
    private final PollRepository pollRepository;
    private final PollOptionRepository pollOptionRepository;
    private final MemberRepository memberRepository;

    // 투표 목록 조회
    @Transactional(readOnly = true)
    public List<PollListResDto> getPollList() {
        List<Poll> polls = pollRepository.findAll(
                Sort.by(Sort.Direction.DESC, "regDate")
        );

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
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "해당 투표가 존재하지 않습니다."
            );
        }

        return toDetailDto(poll.get());
    }

    // 투표 등록
    public PollCreateResDto createPoll(PollCreateReqDto pollCreateReqDto) {

        // 선택지는 반드시 2개
        if (pollCreateReqDto.getOptions() == null
                || pollCreateReqDto.getOptions().size() != 2) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "선택지는 반드시 2개여야 합니다."
            );
        }

        // 선택지 내용 검사
        for (String option : pollCreateReqDto.getOptions()) {
            if (option == null || option.isBlank()) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "선택지 내용을 입력해주세요."
                );
            }

            if (option.length() > 255) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "선택지는 255자 이하로 입력해주세요."
                );
            }
        }

        // 마감일시 필수 입력 검사
        if (pollCreateReqDto.getDeadline() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "마감일시를 입력해주세요."
            );
        }

        // 마감일시는 현재보다 미래여야 함
        if (!pollCreateReqDto.getDeadline().isAfter(LocalDateTime.now())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "마감일시는 현재 이후로 설정해야 합니다."
            );
        }

        // 제목 또는 내용 빈문자열 검사
        if (pollCreateReqDto.getTitle() == null
                || pollCreateReqDto.getTitle().isBlank()
                || pollCreateReqDto.getContent() == null
                || pollCreateReqDto.getContent().isBlank()) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "제목 또는 내용을 입력해주세요."
            );
        }

        // 제목 길이 검사
        if (pollCreateReqDto.getTitle().length() > 200) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "제목은 200자 이하로 입력해주세요."
            );
        }

        // TODO: 로그인 연동 후 작성자 조회 방식 변경
        Optional<Member> member = memberRepository.findById(1L);

        if (member.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "회원이 존재하지 않습니다."
            );
        }

        // 게시글 Entity 생성
        Poll poll = new Poll();
        poll.setMember(member.get());
        poll.setTitle(pollCreateReqDto.getTitle());
        poll.setContent(pollCreateReqDto.getContent());
        poll.setDeadline(pollCreateReqDto.getDeadline());

        // 게시글 저장
        Poll savedPoll = pollRepository.save(poll);

        // 선택지 응답 DTO 리스트
        List<PollOptionResDto> optionDtos = new ArrayList<>();

        // 선택지 2개 저장
        for (String content : pollCreateReqDto.getOptions()) {
            PollOption option = new PollOption();
            option.setPoll(savedPoll);
            option.setContent(content);

            PollOption savedOption = pollOptionRepository.save(option);

            // 선택지 Entity → DTO 변환
            PollOptionResDto optionDto = new PollOptionResDto();
            optionDto.setOptionId(savedOption.getOptionId());
            optionDto.setContent(savedOption.getContent());

            optionDtos.add(optionDto);
        }

        // 응답 DTO 생성
        PollCreateResDto resDto = new PollCreateResDto();
        resDto.setPollId(savedPoll.getPollId());
        resDto.setTitle(savedPoll.getTitle());
        resDto.setContent(savedPoll.getContent());
        resDto.setOptions(optionDtos);
        resDto.setDeadline(savedPoll.getDeadline());

        return resDto;
    }

    // 목록 조회 DTO 변환
    private PollListResDto toDto(Poll poll) {
        PollListResDto pollListResDto = new PollListResDto();
        pollListResDto.setPollId(poll.getPollId());
        pollListResDto.setTitle(poll.getTitle());
        pollListResDto.setRegDate(poll.getRegDate());
        pollListResDto.setDeadline(poll.getDeadline());

        return pollListResDto;
    }

    // 상세 조회 DTO 변환
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
