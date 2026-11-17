package com.eitheror.backend.dto;

import java.time.Instant;

public record PendingSocialLogin(
        String code,
        Long memberId,
        Instant expiresAt
) {
}