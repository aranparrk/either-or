package com.eitheror.backend.controller;

import com.eitheror.backend.dto.CommentCreateReqDto;
import com.eitheror.backend.dto.CommentResDto;
import com.eitheror.backend.service.CommentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Tag(name = "댓글 API", description = "댓글 작성, 댓글 조회")
@Slf4j
@RestController
@RequestMapping("/api/votes")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class CommentController {

    private final CommentService commentService;

    @Operation(summary = "댓글 등록", description = "투표 게시글에 댓글을 작성합니다.")
    @PostMapping("/{id}/comments")
    public ResponseEntity<CommentResDto> createComment(
            @PathVariable Long id,
            @Valid @RequestBody CommentCreateReqDto requestDto,
            HttpSession session) {

        Long memberId = (Long) session.getAttribute("LOGIN_MEMBER_ID");

        if (memberId == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "로그인이 필요합니다."
            );
        }

        CommentResDto responseDto =
                commentService.createComment(memberId, id, requestDto);

        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }

    @Operation(summary = "댓글 조회", description = "댓글을 조회힙나다")
    @GetMapping("/{id}/comments")
    public ResponseEntity<List<CommentResDto>> getComment(@PathVariable Long id) {
        return ResponseEntity.ok(commentService.getCommentList(id));

    }
}