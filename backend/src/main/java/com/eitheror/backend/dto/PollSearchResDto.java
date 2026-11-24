package com.eitheror.backend.dto;

import java.util.List;

public record PollSearchResDto(
        int totalCnt,
        int titleCnt,
        int contentCnt,
        int pollOptionCnt,
        List<PollListResDto>polls
) {
    // 검색 결과 게시글 개수 응답 DTO
}
