package com.eitheror.backend.controller;


import com.eitheror.backend.dto.VoteCreateReqDto;
import com.eitheror.backend.dto.VoteResDto;
import com.eitheror.backend.service.VoteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "투표 참여 API", description = "투표 참여, 선택 변경, 결과 조회")
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/votes")
@CrossOrigin(origins = "http://localhost:5173")
public class VoteController {
    private final VoteService voteService;

    @Operation(summary = "투표 참여", description = "투표에 참여합니다.")
    @PostMapping("/{id}/choices")
    public ResponseEntity<VoteResDto> createVote(
            @PathVariable Long id,
            @RequestBody VoteCreateReqDto voteCreateReqDto) {

        return ResponseEntity.ok(voteService.createVote(id, voteCreateReqDto));
    }
}
