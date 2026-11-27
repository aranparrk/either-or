package com.eitheror.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record PollComparisonReqDto(
        @NotBlank @Size(max = 200) String title,
        @NotBlank @Size(max = 255) String optionA,
        @NotBlank @Size(max = 255) String optionB,
        @Pattern(regexp = "[0-9]{1,32}") String contentIdA,
        @Pattern(regexp = "[0-9]{1,32}") String contentIdB
) {}
