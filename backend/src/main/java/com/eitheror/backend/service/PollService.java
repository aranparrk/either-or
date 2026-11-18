
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

import java.net.URI;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
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

    // ====================================
    // 내가 작성한 투표 조회 (마이페이지)
    // ====================================
    @Transactional(readOnly = true)
    public List<PollListResDto> getMyPollList(Long memberId) {

        // 로그인한 회원이 작성한 투표만 가져오기
        List<Poll> polls =
                pollRepository.findByMember_MemberIdOrderByRegDateDesc(
                        memberId
                );

        // 화면에 전달할 투표 목록
        List<PollListResDto> result = new ArrayList<>();

        for (Poll poll : polls) {

            // 기존 DTO 변환 메서드 사용
            result.add(toDto(poll));
        }

        return result;
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
        poll.setContent(normalizeContent(pollCreateReqDto.getContent()));
        poll.setDeadline(pollCreateReqDto.getDeadline());
        poll.setContentImage(pollCreateReqDto.getContentImage());

        // 게시글 저장
        Poll savedPoll = pollRepository.save(poll);

        // 선택지 응답 DTO 리스트
        List<PollOptionResDto> optionDtos = new ArrayList<>();

        // 선택지 2개 저장
        for (int i = 0; i < pollCreateReqDto.getOptions().size(); i++) {

            PollOption option = new PollOption();
            option.setPoll(savedPoll);
            option.setContent(pollCreateReqDto.getOptions().get(i));
            if (pollCreateReqDto.getTourOptions() != null) {
                setTourOption(option, pollCreateReqDto.getTourOptions().get(i));
            }

            PollOption savedOption = pollOptionRepository.save(option);
            optionDtos.add(toOptionDto(savedOption));
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

    private void validatePoll(
            PollCreateReqDto pollCreateReqDto,
            LocalDateTime existingDeadline
    ) {

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

        if (pollCreateReqDto.getTourOptions() != null) {
            if (pollCreateReqDto.getTourOptions().size() != pollCreateReqDto.getOptions().size()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "관광지 정보는 선택지와 순서 및 개수가 같아야 합니다.");
            }
            for (PollCreateReqDto.TourOption tour : pollCreateReqDto.getTourOptions()) {
                if (tour != null && (tour.contentId() == null || !tour.contentId().matches("[0-9]{1,32}")
                        || !isValidTourImageUrl(tour.imageUrl()))) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "관광지 ID 또는 이미지 주소가 올바르지 않습니다.");
                }
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

        if (pollCreateReqDto.getTitle() == null
                || pollCreateReqDto.getTitle().isBlank()) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "제목을 입력해주세요."
            );
        }

        // 제목 길이 검사
        if (pollCreateReqDto.getTitle().length() > 200) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "제목은 200자 이하로 입력해주세요."
            );
        }

        if (pollCreateReqDto.getContentImage() != null
                && pollCreateReqDto.getContentImage().length() > 1000) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "이미지 주소가 너무 깁니다."
            );
        }
    }

    // 작성자 확인
    private Poll ownedPoll(Long pollId) {

        Long memberId = SecurityUtil.currentMemberId();

        Poll poll = pollRepository.findByIdForUpdate(pollId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "해당 투표가 존재하지 않습니다."
                ));

        if (!poll.getMember().getMemberId().equals(memberId)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "작성자만 수정하거나 삭제할 수 있습니다."
            );
        }

        return poll;
    }

    // 투표 수정
    public PollDetailResDto updatePoll(Long pollId, PollCreateReqDto dto) {

        Poll poll = ownedPoll(pollId);

        validatePoll(dto, poll.getDeadline());

        List<PollOption> options = new ArrayList<>(
                pollOptionRepository.findByPoll_PollId(pollId)
        );

        options.sort(
                java.util.Comparator.comparing(PollOption::getOptionId)
        );

        if (options.size() != 2) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "선택지 정보를 확인해주세요."
            );
        }

        String content = normalizeContent(dto.getContent());
        boolean changed = !Objects.equals(poll.getTitle(), dto.getTitle())
                || !normalizeContent(poll.getContent()).equals(content)
                || !Objects.equals(poll.getContentImage(), dto.getContentImage());
        List<PollCreateReqDto.TourOption> tourOptions = new ArrayList<>(options.size());
        for (int i = 0; i < options.size(); i++) {
            PollOption option = options.get(i);
            String optionContent = dto.getOptions().get(i);
            PollCreateReqDto.TourOption tour = dto.getTourOptions() == null
                    ? existingTourOption(option, optionContent)
                    : dto.getTourOptions().get(i);
            changed |= !option.getContent().equals(optionContent)
                    || !Objects.equals(option.getTourContentId(), tour == null ? null : tour.contentId())
                    || !Objects.equals(option.getTourImageUrl(), tourImageUrl(tour));
            tourOptions.add(tour);
        }

        if (changed && voteRepository.countByPoll_PollId(pollId) > 0) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "참여자가 있는 투표는 마감일시만 수정할 수 있습니다."
            );
        }

        poll.setTitle(dto.getTitle());
        poll.setContent(content);
        poll.setContentImage(dto.getContentImage());
        poll.setDeadline(dto.getDeadline());

        for (int i = 0; i < options.size(); i++) {
            PollOption option = options.get(i);
            option.setContent(dto.getOptions().get(i));
            setTourOption(option, tourOptions.get(i));
        }

        return toDetailDto(poll);
    }

    // 투표 삭제
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
        pollListResDto.setContentImage(poll.getContentImage());

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
        pollDetailResDto.setTotalVotes(
                voteRepository.countByPoll_PollId(poll.getPollId())
        );
        pollDetailResDto.setTitle(poll.getTitle());
        pollDetailResDto.setContent(poll.getContent());
        pollDetailResDto.setContentImage(poll.getContentImage());

        // 해당 게시글에 속한 선택지 조회
        List<PollOption> options =
                pollOptionRepository.findByPoll_PollId(poll.getPollId());

        options.sort(
                java.util.Comparator.comparing(PollOption::getOptionId)
        );

        // Entity → DTO 변환
        List<PollOptionResDto> optionDtos = new ArrayList<>();

        for (PollOption option : options) {

            optionDtos.add(toOptionDto(option));
        }

        pollDetailResDto.setOptions(optionDtos);
        pollDetailResDto.setRegDate(poll.getRegDate());
        pollDetailResDto.setDeadline(poll.getDeadline());

        return pollDetailResDto;
    }

    private static String normalizeContent(String content) {
        return content == null || content.isBlank() ? "" : content;
    }

    private static PollOptionResDto toOptionDto(PollOption option) {
        PollOptionResDto dto = new PollOptionResDto();
        dto.setOptionId(option.getOptionId());
        dto.setContent(option.getContent());
        dto.setContentId(option.getTourContentId());
        dto.setImageUrl(option.getTourImageUrl());
        return dto;
    }

    private static PollCreateReqDto.TourOption existingTourOption(PollOption option, String content) {
        if (!option.getContent().equals(content) || option.getTourContentId() == null) {
            return null;
        }
        return new PollCreateReqDto.TourOption(option.getTourContentId(), option.getTourImageUrl());
    }

    private static void setTourOption(PollOption option, PollCreateReqDto.TourOption tour) {
        option.setTourContentId(tour == null ? null : tour.contentId());
        option.setTourImageUrl(tourImageUrl(tour));
    }

    private static String tourImageUrl(PollCreateReqDto.TourOption tour) {
        return tour == null || tour.imageUrl() == null || tour.imageUrl().isBlank() ? null : tour.imageUrl();
    }

    private static boolean isValidTourImageUrl(String imageUrl) {
        if (imageUrl == null || imageUrl.isBlank()) return true;
        if (imageUrl.length() > 1000) return false;
        try {
            URI uri = URI.create(imageUrl);
            return ("https".equalsIgnoreCase(uri.getScheme()) || "http".equalsIgnoreCase(uri.getScheme()))
                    && uri.getHost() != null && uri.getUserInfo() == null;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }
}
