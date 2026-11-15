package com.eitheror.backend.controller;

import com.eitheror.backend.dto.MemberUpdateReqDto;
import com.eitheror.backend.service.MemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "마이페이지", description = "회원정보수정")
@Slf4j
@RestController
@RequestMapping("/api/member")
@RequiredArgsConstructor
public class MemberController {
    private final MemberService memberService;

    // 회원 정보 수정
    @Operation(summary = "회원정보수정", description = "비밀번호와 프로필 이미지를 수정합니다.")
    @PatchMapping("/update")
    public ResponseEntity<Boolean> memberUpdate(@RequestBody MemberUpdateReqDto dto) {
        return ResponseEntity.ok(memberService.memberUpdate(dto));
    }

    // 내가 쓴 투표 조회


    // 내가 쓴 댓글 조회


    // 회원탈퇴


}
