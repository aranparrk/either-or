package com.eitheror.backend.dto;

public record WeeklyDestinationResDto(
        String contentId,
        String name,
        String imageUrl,
        Long pollId,
        Long voteCount
) {}
