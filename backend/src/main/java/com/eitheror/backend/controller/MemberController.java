package com.eitheror.backend.controller;

import com.eitheror.backend.service.MemberService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "마이페이지", description = "회원정보수정")
@Slf4j
@RestController
@RequestMapping("/member")
@RequiredArgsConstructor
public class MemberController {
    private final MemberService memberService;

    // 회원 정보 수정


    // 내가 쓴 투표 조회


    // 내가 쓴 댓글 조회


    // 회원탈퇴


}
