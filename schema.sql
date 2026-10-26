CREATE DATABASE IF NOT EXISTS either_or
DEFAULT CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE either_or;

SHOW DATABASES;


-- 회원 테이블 (members)
-- member_id (PK)
-- email (UNIQUE)
-- pwd
-- image_url
-- reg_date
CREATE TABLE member (
    member_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    pwd VARCHAR(255) NOT NULL,
    image_url VARCHAR(500),
    reg_date DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 투표 게시글 테이블 (polls)
-- poll_id (PK)
-- member_id (FK)
-- title
-- content
-- reg_date
-- deadline
CREATE TABLE polls (
	poll_id BIGINT AUTO_INCREMENT PRIMARY KEY,
	member_id BIGINT NOT NULL,
	title VARCHAR(200) NOT NULL,
	content TEXT NOT NULL,
	reg_date DATETIME DEFAULT CURRENT_TIMESTAMP,
	deadline DATETIME NOT NULL,
	FOREIGN KEY (member_id) REFERENCES member(member_id)
)


-- 투표 선택지 테이블 (poll_options)
-- option_id (PK)
-- poll_id (FK)
-- content
CREATE TABLE poll_options (
	option_id BIGINT AUTO_INCREMENT PRIMARY KEY,
	poll_id BIGINT NOT NULL,
	content VARCHAR(255) NOT NULL,
	FOREIGN KEY (poll_id) REFERENCES polls(poll_id)
)

-- 투표 기록 테이블 (votes)
-- vote_id (PK)
-- member_id (FK)
-- poll_id (FK)
-- option_id (FK)
CREATE TABLE votes (
	vote_id BIGINT AUTO_INCREMENT PRIMARY KEY,
	member_id BIGINT NOT NULL,
	poll_id BIGINT NOT NULL,
	option_id BIGINT NOT NULL,
	FOREIGN KEY (member_id) REFERENCES member(member_id),
	FOREIGN KEY (poll_id) REFERENCES polls(poll_id),
	FOREIGN KEY (option_id) REFERENCES poll_options(option_id),
	
	UNIQUE (member_id, poll_id)
)

-- 댓글 테이블 (comments) - 선택 기능
-- comment_id (PK)
-- poll_id (FK)
-- member_id (FK)
-- content
-- reg_date
CREATE TABLE comments (
	comment_id BIGINT AUTO_INCREMENT PRIMARY KEY,
	member_id BIGINT NOT NULL,
	poll_id BIGINT NOT NULL,
	content VARCHAR(1000) NOT NULL,
	reg_date DATETIME DEFAULT CURRENT_TIMESTAMP,
	
	FOREIGN KEY (member_id) REFERENCES member(member_id),
	FOREIGN KEY (poll_id) REFERENCES polls(poll_id)
)