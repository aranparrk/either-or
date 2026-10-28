package com.eitheror.backend.controller;

import com.eitheror.backend.dto.LoginRequestDto;
import com.eitheror.backend.dto.LoginResponseDto;
import com.eitheror.backend.dto.SignUpRequestDto;
import com.eitheror.backend.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "회원가입 API", description = "회원가입, 로그인, 로그아웃")
@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @Operation(summary = "회원가입", description = "회원가입을 합니다.")
    @PostMapping("/signup")
    public ResponseEntity<Boolean> signUp(@RequestBody SignUpRequestDto dto) {
        return ResponseEntity.ok(authService.signUp(dto));
    }

    @Operation(summary = "로그인", description = "로그인을 합니다.")
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestDto dto, HttpSession session) {
        return ResponseEntity.ok(authService.login(dto, session));
    }

    @Operation(summary = "로그아웃", description = "로그아웃을 합니다.")
    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpSession session) {
        authService.logout(session);
        return ResponseEntity.ok("로그아웃 됐습니다.");
    }
}
