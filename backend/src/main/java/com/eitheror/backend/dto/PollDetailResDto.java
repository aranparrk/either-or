package com.eitheror.backend.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class PollDetailResDto {
    private Long pollId;
    private String title;
    private String content;
    private LocalDateTime regDate;
    private LocalDateTime deadline;
    private List<PollOptionResDto> options;
}
