package com.eitheror.backend.dto;

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
    private LocalDateTime deadline;
}
