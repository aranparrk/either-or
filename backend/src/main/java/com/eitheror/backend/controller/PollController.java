package com.eitheror.backend.controller;

import com.eitheror.backend.dto.PollDetailResDto;
import com.eitheror.backend.dto.PollListResDto;
import com.eitheror.backend.service.PollService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "투표 API", description = "투표 조회, 투표 작성")
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/votes")
@CrossOrigin(origins = "http://localhost:5173")
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
        try {
            return ResponseEntity.ok(pollService.getPollDetail(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}