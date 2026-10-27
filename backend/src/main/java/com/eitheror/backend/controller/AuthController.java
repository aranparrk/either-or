package com.eitheror.backend.controller;

import com.eitheror.backend.dto.SignUpRequestDto;
import com.eitheror.backend.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "회원가입 API", description = "회원가입")
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
}
