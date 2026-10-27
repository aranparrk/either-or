package com.eitheror.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class VoteCreateReqDto {

    @NotNull(message = "선택지를 선택해주세요.")
    private Long optionId;
}
