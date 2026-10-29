package com.eitheror.backend.controller;

import com.eitheror.backend.dto.CommentCreateReqDto;
import com.eitheror.backend.dto.CommentResDto;
import com.eitheror.backend.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PostMapping
    public ResponseEntity<CommentResDto> createComment(
            @RequestParam Long memberId, // 실무/Security 적용 시 세션이나 토큰에서 회원 정보를 가져오도록 수정 가능
            @RequestBody @Valid CommentCreateReqDto requestDto) {

        CommentResDto responseDto = commentService.createComment(memberId, requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }
}

