
package com.eitheror.backend.service;

import com.eitheror.backend.dto.CommentCreateReqDto;
import com.eitheror.backend.dto.CommentResDto;
import com.eitheror.backend.dto.MyCommentResDto;
import com.eitheror.backend.entity.Comment;
import com.eitheror.backend.entity.Member;
import com.eitheror.backend.entity.Poll;
import com.eitheror.backend.repository.CommentRepository;
import com.eitheror.backend.repository.MemberRepository;
import com.eitheror.backend.repository.PollRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CommentService {

    private final CommentRepository commentRepository;
    private final MemberRepository memberRepository;
    private final PollRepository pollRepository;
    private final SimpMessagingTemplate messagingTemplate;

    // 댓글 작성
    @Transactional
    public CommentResDto createComment(
            Long memberId,
            Long pollId,
            CommentCreateReqDto requestDto
    ) {

        // 1. 회원 조회
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "존재하지 않는 회원입니다."
                ));

        // 2. 투표 게시글 조회
        Poll poll = pollRepository.findById(pollId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "존재하지 않는 투표입니다."
                ));

        // 3. 댓글 Entity 생성
        Comment comment = new Comment();

        comment.setMember(member);
        comment.setPoll(poll);
        comment.setContent(requestDto.getContent());

        // 4. 댓글 저장
        Comment savedComment = commentRepository.save(comment);

        // 댓글 변경 알림
        notifyCommentUpdated(pollId);

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

        List<Comment> comments =
                commentRepository.findByPoll_PollIdOrderByRegDateAsc(pollId);

        List<CommentResDto> commentResDtos = new ArrayList<>();

        for (Comment comment : comments) {
            commentResDtos.add(new CommentResDto(comment));
        }

        return commentResDtos;
    }

    // ====================================
    // 내가 작성한 댓글 조회 (마이페이지)
    // ====================================
    @Transactional(readOnly = true)
    public List<MyCommentResDto> getMyCommentList(Long memberId) {

        // 로그인한 회원이 작성한 댓글만 가져오기
        List<Comment> comments =
                commentRepository.findMyComments(memberId);

        // 화면에 전달할 댓글 목록
        List<MyCommentResDto> result = new ArrayList<>();

        for (Comment comment : comments) {

            // 댓글 Entity를 DTO로 변환
            result.add(new MyCommentResDto(comment));
        }

        return result;
    }

    // 댓글 수정
    @Transactional
    public CommentResDto updateComment(
            Long memberId,
            Long pollId,
            Long commentId,
            CommentCreateReqDto dto
    ) {

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

        // 댓글 변경 알림
        notifyCommentUpdated(pollId);

        return new CommentResDto(comment);
    }

    // 댓글 삭제
    @Transactional
    public void deleteComment(
            Long memberId,
            Long pollId,
            Long commentId
    ) {

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

        // 댓글 변경 알림
        notifyCommentUpdated(pollId);

        commentRepository.delete(comment);
    }

    // 댓글 실시간 알림
    private void notifyCommentUpdated(Long pollId) {

        System.out.println("댓글 알림 메서드 호출: " + pollId);

        TransactionSynchronizationManager.registerSynchronization(
                new TransactionSynchronization() {

                    @Override
                    public void afterCommit() {

                        System.out.println("댓글 트랜잭션 커밋 완료");

                        messagingTemplate.convertAndSend(
                                "/topic/comments/" + pollId,
                                "UPDATED"
                        );

                        System.out.println(
                                "댓글 WebSocket 알림 전송: " + pollId
                        );
                    }
                }
        );
    }
}
