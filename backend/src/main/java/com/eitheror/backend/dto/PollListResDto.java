package com.eitheror.backend.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class PollListResDto {
    private Long pollId;
    private String title;
    private LocalDateTime regDate;
    private LocalDateTime deadline;
}
