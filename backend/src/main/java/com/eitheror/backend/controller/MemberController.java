package com.eitheror.backend.controller;

import com.eitheror.backend.dto.MemberUpdateReqDto;
import com.eitheror.backend.service.MemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Tag(name = "마이페이지", description = "회원정보수정")
@Slf4j
@RestController
@RequestMapping("/api/member")
@RequiredArgsConstructor
public class MemberController {
    private final MemberService memberService;

    // 회원 기존 비밀번호 확인
    @Operation(summary = "기존비밀번호확인", description = "기존 비밀번호를 검사합니다.")
    @PostMapping("/check-pwd")
    public ResponseEntity<Boolean> checkPwd(@RequestBody MemberUpdateReqDto dto) {
        return ResponseEntity.ok(memberService.checkCurrentPwd(dto.getCurrentPwd())
        );
    }

    @Operation(summary = "내 닉네임 조회")
    @GetMapping("/nickname")
    public Map<String, String> getNickname() {
        return Map.of("nickname", memberService.getNickname());
    }

    // 회원 정보 수정
    @Operation(summary = "회원정보수정", description = "닉네임, 비밀번호와 프로필 이미지를 수정합니다.")
    @PatchMapping("/update")
    public ResponseEntity<Boolean> memberUpdate(@RequestBody MemberUpdateReqDto dto) {
        return ResponseEntity.ok(memberService.memberUpdate(dto));
    }

}
