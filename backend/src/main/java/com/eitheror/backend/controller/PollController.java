package com.eitheror.backend.controller;

import com.eitheror.backend.dto.PollCreateReqDto;
import com.eitheror.backend.dto.PollCreateResDto;
import com.eitheror.backend.dto.PollDetailResDto;
import com.eitheror.backend.dto.PollListResDto;
import com.eitheror.backend.service.PollService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Tag(name = "투표 API", description = "투표 조회, 투표 작성")
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/votes")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class PollController {

    private final PollService pollService;

    @Operation(summary = "투표 전체 조회", description = "등록된 모든 투표를 조회합니다.")
    @GetMapping
    public ResponseEntity<List<PollListResDto>> getPollList() {
        return ResponseEntity.ok(pollService.getPollList());
    }

    @Operation(summary = "투표 상세 조회", description = "투표 ID로 상세 정보를 조회합니다.")
    @GetMapping("/{id}")
    public ResponseEntity<PollDetailResDto> getPollDetail(@PathVariable Long id) {
        return ResponseEntity.ok(pollService.getPollDetail(id));
    }

    @Operation(summary = "투표 등록", description = "투표를 등록합니다.")
    @PostMapping
    public ResponseEntity<PollCreateResDto> createPoll(
            @RequestBody PollCreateReqDto dto,
            HttpSession session) {

        Long memberId = (Long) session.getAttribute("LOGIN_MEMBER_ID");

        if (memberId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"로그인이 필요합니다.");
        }

        return ResponseEntity.ok(pollService.createPoll(dto, memberId));
    }
}