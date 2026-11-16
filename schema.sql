
-- ============================================================
-- Either Or (양자택일) Database Schema
-- MySQL 8.x
-- 신규 개발 환경의 데이터베이스 초기 생성용
-- ============================================================

CREATE DATABASE IF NOT EXISTS either_or
    DEFAULT CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE either_or;


-- ============================================================
-- 1. 회원 (member)
-- 일반 회원가입 및 소셜 회원가입 공통
-- ============================================================

CREATE TABLE member (
    member_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) UNIQUE,
    pwd VARCHAR(255),
    image_url VARCHAR(500),
    profile_image_id INT NOT NULL DEFAULT 1,
    reg_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    authority VARCHAR(20) NOT NULL DEFAULT 'ROLE_USER'
);


-- ============================================================
-- 2. 투표 게시글 (polls)
-- ============================================================

CREATE TABLE polls (
    poll_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    content_image VARCHAR(1000),
    reg_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    deadline DATETIME NOT NULL,

    FOREIGN KEY (member_id)
        REFERENCES member(member_id)
);


-- ============================================================
-- 3. 투표 선택지 (poll_options)
-- ============================================================

CREATE TABLE poll_options (
    option_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    poll_id BIGINT NOT NULL,
    content VARCHAR(255) NOT NULL,

    FOREIGN KEY (poll_id)
        REFERENCES polls(poll_id)
);


-- ============================================================
-- 4. 투표 기록 (votes)
-- 회원당 하나의 투표에 한 번만 참여
-- ============================================================

CREATE TABLE votes (
    vote_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id BIGINT NOT NULL,
    poll_id BIGINT NOT NULL,
    option_id BIGINT NOT NULL,

    FOREIGN KEY (member_id)
        REFERENCES member(member_id),

    FOREIGN KEY (poll_id)
        REFERENCES polls(poll_id),

    FOREIGN KEY (option_id)
        REFERENCES poll_options(option_id),

    UNIQUE KEY uk_member_poll (member_id, poll_id)
);


-- ============================================================
-- 5. 댓글 (comments)
-- ============================================================

CREATE TABLE comments (
    comment_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id BIGINT NOT NULL,
    poll_id BIGINT NOT NULL,
    content VARCHAR(1000) NOT NULL,
    reg_date DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (member_id)
        REFERENCES member(member_id),

    FOREIGN KEY (poll_id)
        REFERENCES polls(poll_id)
);


-- ============================================================
-- 6. JWT Refresh Token (refresh_token)
-- 회원당 Refresh Token 1개 저장
-- ============================================================

CREATE TABLE refresh_token (
    refresh_token_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id BIGINT NOT NULL UNIQUE,
    token VARCHAR(512) NOT NULL,
    expires_at DATETIME(6) NOT NULL,

    CONSTRAINT fk_refresh_token_member
        FOREIGN KEY (member_id)
        REFERENCES member(member_id)
);


-- ============================================================
-- 7. 소셜 계정 (social_account)
-- KAKAO / GOOGLE 계정과 기존 회원 연결
-- ============================================================

CREATE TABLE social_account (
    social_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id BIGINT NOT NULL,
    provider VARCHAR(20) NOT NULL,
    provider_id VARCHAR(255) NOT NULL,

    UNIQUE KEY uk_provider_id (provider, provider_id),

    FOREIGN KEY (member_id)
        REFERENCES member(member_id)
);