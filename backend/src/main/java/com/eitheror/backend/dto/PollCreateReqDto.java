package com.eitheror.backend.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class PollCreateReqDto {
    private String title;
    private String content;
    private List<String> options;

    @NotNull(message = "마감일시는 필수입니다.")
    @Future(message = "마감일시는 현재보다 미래여야 합니다.")
    private LocalDateTime deadline;
}
