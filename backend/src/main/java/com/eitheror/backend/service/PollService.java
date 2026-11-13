
package com.eitheror.backend.service;

import com.eitheror.backend.dto.*;
import com.eitheror.backend.entity.Member;
import com.eitheror.backend.entity.Poll;
import com.eitheror.backend.entity.PollOption;
import com.eitheror.backend.repository.MemberRepository;
import com.eitheror.backend.repository.PollOptionRepository;
import com.eitheror.backend.repository.PollRepository;
import com.eitheror.backend.repository.VoteRepository;
import com.eitheror.backend.security.SecurityUtil;
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
    private final VoteRepository voteRepository;
    private final com.eitheror.backend.repository.CommentRepository commentRepository;

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

        validatePoll(pollCreateReqDto, null);

        // JWT에서 로그인한 회원번호 가져오기
        Long memberId = SecurityUtil.currentMemberId();

        // TODO: 로그인 연동 후 작성자 조회 방식 변경
        Optional<Member> member = memberRepository.findById(memberId);

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
        poll.setContentImage(pollCreateReqDto.getContentImage()); // 투표 등록 시 이미지 등록 추가

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
        resDto.setContentImage(savedPoll.getContentImage());

        return resDto;
    }

    private void validatePoll(PollCreateReqDto pollCreateReqDto, LocalDateTime existingDeadline) {
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
        if (!pollCreateReqDto.getDeadline().equals(existingDeadline)
                && !pollCreateReqDto.getDeadline().isAfter(LocalDateTime.now())) {
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

        if (pollCreateReqDto.getContentImage() != null && pollCreateReqDto.getContentImage().length() > 1000) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "이미지 주소가 너무 깁니다.");
        }
    }

    private Poll ownedPoll(Long pollId) {
        Long memberId = SecurityUtil.currentMemberId();
        Poll poll = pollRepository.findByIdForUpdate(pollId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "해당 투표가 존재하지 않습니다."));
        if (!poll.getMember().getMemberId().equals(memberId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "작성자만 수정하거나 삭제할 수 있습니다.");
        }
        return poll;
    }

    public PollDetailResDto updatePoll(Long pollId, PollCreateReqDto dto) {
        Poll poll = ownedPoll(pollId);
        validatePoll(dto, poll.getDeadline());
        List<PollOption> options = new ArrayList<>(pollOptionRepository.findByPoll_PollId(pollId));
        options.sort(java.util.Comparator.comparing(PollOption::getOptionId));
        if (options.size() != 2) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "선택지 정보를 확인해주세요.");
        }
        boolean changed = !options.get(0).getContent().equals(dto.getOptions().get(0))
                || !options.get(1).getContent().equals(dto.getOptions().get(1));
        if (changed && voteRepository.countByPoll_PollId(pollId) > 0) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "참여자가 있는 투표는 선택지를 수정할 수 없습니다.");
        }
        poll.setTitle(dto.getTitle());
        poll.setContent(dto.getContent());
        poll.setContentImage(dto.getContentImage());
        poll.setDeadline(dto.getDeadline());
        for (int i = 0; i < options.size(); i++) {
            options.get(i).setContent(dto.getOptions().get(i));
        }
        return toDetailDto(poll);
    }

    public void deletePoll(Long pollId) {
        Poll poll = ownedPoll(pollId);
        commentRepository.deleteAllByPollId(pollId);
        voteRepository.deleteAllByPollId(pollId);
        pollOptionRepository.deleteAllByPollId(pollId);
        pollRepository.delete(poll);
    }

    // 목록 조회 DTO 변환
    private PollListResDto toDto(Poll poll) {
        PollListResDto pollListResDto = new PollListResDto();
        pollListResDto.setPollId(poll.getPollId());
        pollListResDto.setTitle(poll.getTitle());
        pollListResDto.setRegDate(poll.getRegDate());
        pollListResDto.setDeadline(poll.getDeadline());
        pollListResDto.setContentImage(poll.getContentImage()); // 목록 조회에서 썸네일 추가

        // 투표 참여자 수 추가
        pollListResDto.setTotalVotes(
                voteRepository.countByPoll_PollId(poll.getPollId())
        );

        return pollListResDto;
    }

    // 상세 조회 DTO 변환
    private PollDetailResDto toDetailDto(Poll poll) {
        PollDetailResDto pollDetailResDto = new PollDetailResDto();

        pollDetailResDto.setPollId(poll.getPollId());
        pollDetailResDto.setAuthorId(poll.getMember().getMemberId());
        pollDetailResDto.setTotalVotes(voteRepository.countByPoll_PollId(poll.getPollId()));
        pollDetailResDto.setTitle(poll.getTitle());
        pollDetailResDto.setContent(poll.getContent());
        pollDetailResDto.setContentImage(poll.getContentImage()); // 상세 조회에서 이미지 추가

        // 해당 게시글에 속한 선택지 조회
        List<PollOption> options =
                pollOptionRepository.findByPoll_PollId(poll.getPollId());

        options.sort(java.util.Comparator.comparing(PollOption::getOptionId));

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
