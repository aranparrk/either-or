package com.eitheror.backend.controller;

import com.eitheror.backend.dto.VoteCreateReqDto;
import com.eitheror.backend.dto.VoteResDto;
import com.eitheror.backend.dto.VoteResultResDto;
import com.eitheror.backend.service.VoteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@Tag(name = "투표 참여 API", description = "투표 참여, 선택 변경, 결과 조회")
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/votes")
public class VoteController {

    private final VoteService voteService;

    @Operation(summary = "투표 참여", description = "투표에 참여합니다.")
    @PostMapping("/{id}/choices")
    public ResponseEntity<VoteResDto> createVote(
            @PathVariable Long id,
            @RequestBody VoteCreateReqDto dto,
            Authentication authentication
    ) {
        Long memberId = Long.valueOf(authentication.getName());

        return ResponseEntity.ok(
                voteService.createVote(id, dto, memberId)
        );
    }

    @Operation(summary = "투표 선택 변경", description = "투표 선택을 변경합니다.")
    @PutMapping("/{id}/choices")
    public ResponseEntity<VoteResDto> updateVote(
            @PathVariable Long id,
            @RequestBody VoteCreateReqDto dto,
            Authentication authentication
    ) {
        Long memberId = Long.valueOf(authentication.getName());

        return ResponseEntity.ok(
                voteService.updateVote(id, dto, memberId)
        );
    }

    @Operation(summary = "투표 결과 조회", description = "투표 결과를 조회합니다.")
    @GetMapping("/{id}/results")
    public ResponseEntity<VoteResultResDto> getVoteResult(
            @PathVariable Long id,
            Authentication authentication
    ) {
        // 비로그인 상태에서는 기존처럼 null 전달
        Long memberId = null;

        if (authentication != null
                && authentication.isAuthenticated()
                && !(authentication instanceof AnonymousAuthenticationToken)) {
            memberId = Long.valueOf(authentication.getName());
        }

        return ResponseEntity.ok(
                voteService.getVoteResult(id, memberId)
        );
    }
}