package com.eitheror.backend.controller;

import com.eitheror.backend.security.SecurityUtil;
import com.eitheror.backend.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    // 즐겨찾기 등록
    @PostMapping("/{pollId}")
    public ResponseEntity<Void> addFavorite(
            @PathVariable Long pollId
    ) {
        Long memberId = SecurityUtil.currentMemberId();

        favoriteService.addFavorite(memberId, pollId);

        return ResponseEntity.ok().build();
    }

    // 즐겨찾기 취소
    @DeleteMapping("/{pollId}")
    public ResponseEntity<Void> removeFavorite(
            @PathVariable Long pollId
    ) {
        Long memberId = SecurityUtil.currentMemberId();

        favoriteService.removeFavorite(memberId, pollId);

        return ResponseEntity.noContent().build();
    }

    // 즐겨찾기 여부 확인
    @GetMapping("/{pollId}/status")
    public ResponseEntity<Boolean> getFavoriteStatus(
            @PathVariable Long pollId
    ) {
        Long memberId = SecurityUtil.currentMemberId();

        return ResponseEntity.ok(
                favoriteService.isFavorite(memberId, pollId)
        );
    }
}