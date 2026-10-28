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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CommentService {

    private final CommentRepository commentRepository;
    private final MemberRepository memberRepository;
    private final PollRepository pollRepository;

    @Transactional
    public CommentResDto createComment(Long memberId, CommentCreateReqDto requestDto) {
        // 1. 회원 조회 검증
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

        // 2. 투표 게시글 조회 검증
        Poll poll = pollRepository.findById(requestDto.getPollId())
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
}
