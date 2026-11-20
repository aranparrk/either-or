package com.eitheror.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class FavoriteResDto {

    private Long favoriteId;
    private Long pollId;
    private String title;
    private LocalDateTime regDate;
    private LocalDateTime deadline;
    private Long totalVotes;
}