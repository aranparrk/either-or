package com.eitheror.backend.dto;

public record TokenDto(
        String grantType,
        String accessToken,
        long accessTokenExpiresAt
) {
}