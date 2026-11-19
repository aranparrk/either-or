-- 002 적용 후 실행. 중복이 있으면 아래 조회 결과를 보고 먼저 닉네임을 정리합니다.
SELECT nickname, COUNT(*) AS member_count
FROM `member`
GROUP BY nickname
HAVING COUNT(*) > 1;

ALTER TABLE `member`
    ADD CONSTRAINT uk_member_nickname UNIQUE (nickname);
