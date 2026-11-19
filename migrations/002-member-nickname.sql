ALTER TABLE `member`
    ADD COLUMN nickname VARCHAR(20) NULL;

UPDATE `member`
SET nickname = CASE WHEN member_id <= 99999999999999999
                    THEN CONCAT('여행자', member_id)
                    ELSE CAST(member_id AS CHAR) END
WHERE nickname IS NULL;

ALTER TABLE `member`
    MODIFY COLUMN nickname VARCHAR(20) NOT NULL;
