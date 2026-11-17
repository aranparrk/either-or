package com.eitheror.backend.dto;

import com.eitheror.backend.entity.Comment;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class MyCommentResDto {

    private Long commentId;

    private Long pollId;

    private String pollTitle;

    private String content;

    private LocalDateTime regDate;

    public MyCommentResDto(Comment comment) {

        this.commentId = comment.getCommentId();

        this.pollId = comment.getPoll().getPollId();

        this.pollTitle = comment.getPoll().getTitle();

        this.content = comment.getContent();

        this.regDate = comment.getRegDate();
    }
}
