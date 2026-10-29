package com.eitheror.backend.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class VoteResultResDto {
    private Long pollId;
    private long totalVotes;
    private List<VoteOptionResultResDto> options;
}