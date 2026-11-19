
package com.eitheror.backend.controller;

import com.eitheror.backend.dto.MyCommentResDto;
import com.eitheror.backend.dto.PollListResDto;
import com.eitheror.backend.security.SecurityUtil;
import com.eitheror.backend.service.CommentService;
import com.eitheror.backend.service.PollService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "마이페이지 API", description = "마이페이지")
@RestController
@RequestMapping("/api/mypage")
@RequiredArgsConstructor
public class MyPageController {

    private final PollService pollService;
    private final CommentService commentService;

    // 내가 작성한 투표 조회
    @Operation(summary = "투표 조회", description = "내가 쓴 투표 조회")
    @GetMapping("/polls")
    public ResponseEntity<List<PollListResDto>> getMyPolls() {

        // 현재 로그인한 회원 번호 가져오기
        Long memberId = SecurityUtil.currentMemberId();

        // 내가 작성한 투표 조회
        List<PollListResDto> result =
                pollService.getMyPollList(memberId);

        return ResponseEntity.ok(result);
    }

    // 내가 작성한 댓글 조회
    @Operation(summary = "댓글 조회", description = "내가 쓴 댓글 조회")
    @GetMapping("/comments")
    public ResponseEntity<List<MyCommentResDto>> getMyComments() {

        // 현재 로그인한 회원 번호 가져오기
        Long memberId = SecurityUtil.currentMemberId();

        // 내가 작성한 댓글 조회
        List<MyCommentResDto> result =
                commentService.getMyCommentList(memberId);

        return ResponseEntity.ok(result);
    }
}
