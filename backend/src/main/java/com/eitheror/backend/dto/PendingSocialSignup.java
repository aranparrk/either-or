package com.eitheror.backend.dto;

import com.eitheror.backend.constant.SocialProvider;
import java.time.Instant;

public record PendingSocialSignup(
        SocialProvider provider,
        String providerId,
        Instant expiresAt
) {
}