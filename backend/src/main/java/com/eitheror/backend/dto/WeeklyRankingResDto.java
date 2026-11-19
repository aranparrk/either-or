package com.eitheror.backend.dto;

public record WeeklyRankingResDto(
        Long pollId,
        String title,
        Long voteCount
) {}
