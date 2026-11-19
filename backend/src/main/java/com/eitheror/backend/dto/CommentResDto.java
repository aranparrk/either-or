package com.eitheror.backend.dto;

import com.eitheror.backend.entity.Comment;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class CommentResDto {

    private Long commentId;
    private Long pollId;
    private Long memberId;
    private String nickname;
    private String content;
    private LocalDateTime regDate;

    public CommentResDto(Comment comment) {
        this.commentId = comment.getCommentId();
        this.pollId = comment.getPoll().getPollId();
        this.memberId = comment.getMember().getMemberId();
        this.nickname = comment.getMember().getNickname();
        this.content = comment.getContent();
        this.regDate = comment.getRegDate();
    }
}

