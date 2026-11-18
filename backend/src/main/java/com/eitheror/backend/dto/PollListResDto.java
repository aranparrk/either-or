package com.eitheror.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class PollListResDto {
    private Long pollId;
    private String title;
    private LocalDateTime regDate;
    private LocalDateTime deadline;
    private Long totalVotes;
    private String contentImage;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private List<PollOptionResDto> options;
}
