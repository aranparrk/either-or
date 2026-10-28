package com.eitheror.backend.dto;

import com.eitheror.backend.entity.Comment;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class CommentResDto {

    private Long commentId;
    private Long pollId;
    private Long memberId;
    private String email;          // 작성자 식별용 (또는 닉네임)
    private String content;
    private LocalDateTime regDate;

    public CommentResDto(Comment comment) {
        this.commentId = comment.getCommentId();
        this.pollId = comment.getPoll().getPollId();
        this.memberId = comment.getMember().getMemberId();
        this.email = comment.getMember().getEmail();
        this.content = comment.getContent();
        this.regDate = comment.getRegDate();
    }
}
