package com.eitheror.backend.service;

import com.eitheror.backend.dto.CommentCreateReqDto;
import com.eitheror.backend.dto.CommentResDto;
import com.eitheror.backend.entity.Comment;
import com.eitheror.backend.entity.Member;
import com.eitheror.backend.entity.Poll;
import com.eitheror.backend.repository.CommentRepository;
import com.eitheror.backend.repository.MemberRepository;
import com.eitheror.backend.repository.PollRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CommentService {

    private final CommentRepository commentRepository;
    private final MemberRepository memberRepository;
    private final PollRepository pollRepository;

    // 댓글 작성
    @Transactional
    public CommentResDto createComment(
            Long memberId,
            Long pollId,
            CommentCreateReqDto requestDto) {
        // 1. 회원 조회 검증
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

        // 2. 투표 게시글 조회 검증
        Poll poll = pollRepository.findById(pollId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 투표입니다."));

        // 3. 댓글 엔티티 생성 및 연관관계 설정
        Comment comment = new Comment();
        comment.setMember(member);
        comment.setPoll(poll);
        comment.setContent(requestDto.getContent());

        // 4. 저장 후 응답 DTO로 변환 반환
        Comment savedComment = commentRepository.save(comment);
        return new CommentResDto(savedComment);
    }

    // 댓글 조회
    @Transactional(readOnly = true)
    public List<CommentResDto> getCommentList(Long pollId) {
        boolean pollExists = pollRepository.existsById(pollId);

        if (!pollExists) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "게시글이 존재하지 않습니다."
            );
        }

        List<Comment> comments = commentRepository.findByPoll_PollIdOrderByRegDateAsc(pollId);
        List<CommentResDto> commentResDtos = new ArrayList<>();
        for (Comment comment : comments) {
            commentResDtos.add(new CommentResDto(comment));
        }

        return commentResDtos;
    }

    // 댓글 수정
    @Transactional
    public CommentResDto updateComment(Long memberId, Long pollId, Long commentId, CommentCreateReqDto dto) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "댓글이 존재하지 않습니다."
                ));

        if (!comment.getPoll().getPollId().equals(pollId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "해당 투표의 댓글이 아닙니다."
            );
        }

        Member author = comment.getMember();
        Long authorId = author.getMemberId();

        if (!authorId.equals(memberId)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "작성자만 수정할 수 있습니다."
            );
        }

        String content = dto.getContent();
        comment.setContent(content);

        return new CommentResDto(comment);

    }

    // 댓글 삭제
    @Transactional
    public void deleteComment(Long memberId, Long pollId, Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "댓글이 존재하지 않습니다."
                ));

        if (!comment.getPoll().getPollId().equals(pollId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "해당 투표의 댓글이 아닙니다."
            );
        }

        Member author = comment.getMember();
        Long authorId = author.getMemberId();

        if (!authorId.equals(memberId)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "작성자만 삭제할 수 있습니다."
            );
        }

        commentRepository.delete(comment);
    }
}

