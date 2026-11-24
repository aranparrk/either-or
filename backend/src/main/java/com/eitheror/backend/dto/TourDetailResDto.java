package com.eitheror.backend.dto;

public record TourDetailResDto(
        String contentId,
        String title,
        String address,
        String overview,
        String imageUrl
) {}