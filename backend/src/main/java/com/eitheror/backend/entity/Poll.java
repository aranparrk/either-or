package com.eitheror.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "polls")
@Getter
@Setter
@NoArgsConstructor
public class Poll {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "poll_id")
    private Long pollId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "reg_date", updatable = false)
    private LocalDateTime regDate;

    @Column(name = "deadline", nullable = false)
    private LocalDateTime deadline;

    @PrePersist
    public void prePersist() {
        if (this.regDate == null) {
            this.regDate = LocalDateTime.now();
        }
    }
}
