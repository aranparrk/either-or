package com.eitheror.backend.service;

import com.eitheror.backend.entity.Member;
import com.eitheror.backend.repository.MemberRepository;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

final class Nicknames {
    private Nicknames() {}

    static String requireValid(String value) {
        String nickname = value == null ? "" : value.strip();
        if (nickname.isEmpty() || nickname.length() > 20) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "닉네임은 1~20자로 입력해 주세요.");
        }
        return nickname;
    }

    static void saveMember(MemberRepository repository, Member member) {
        try {
            repository.saveAndFlush(member);
        } catch (DataIntegrityViolationException e) {
            for (Throwable cause = e; cause != null; cause = cause.getCause()) {
                if (cause instanceof ConstraintViolationException violation
                        && violation.getConstraintName() != null
                        && violation.getConstraintName().endsWith("uk_member_nickname")) {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 사용 중인 닉네임입니다.");
                }
            }
            throw e;
        }
    }
}
