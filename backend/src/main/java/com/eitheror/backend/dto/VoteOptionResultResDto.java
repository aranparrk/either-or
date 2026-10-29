package com.eitheror.backend.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class VoteOptionResultResDto {
    private Long optionId;
    private long voteCount;
    private double percentage;
}