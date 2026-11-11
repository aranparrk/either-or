package com.eitheror.backend.entity;

import com.eitheror.backend.constant.Authority;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

@Entity
@Table(name = "member")
@Getter
@Setter
@NoArgsConstructor
@ToString(exclude = "pwd")
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_id")
    private Long memberId;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false, length = 255)
    private String pwd;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    // 사용자가 선택한 프로필 번호를 저장하기 위해 Integer 타입으로 profileId 추가
    @Column(name = "profile_image_id")
    private Integer profileId;

    @Column(name = "reg_date", updatable = false)
    private LocalDateTime regDate;

    // 사용자에게 ROLE_USER(일반회원) 권한을 주기 위해 authority 추가
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Authority authority;

    @PrePersist
    public void prePersist() {
        if (this.regDate == null) {
            this.regDate = LocalDateTime.now();
        }
    }
}