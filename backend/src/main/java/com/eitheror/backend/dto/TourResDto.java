package com.eitheror.backend.dto;

public record TourResDto(
        String contentId,
        String title,
        String address,
        String imageUrl,
        String contentTypeId
) {}