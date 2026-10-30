import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import AxiosApi from "../api/AxiosApi.jsx";

// 이메일: 공백·@ 없는 문자 + @ + 도메인 + . + 2자 이상 최상위 도메인
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// 비밀번호: 8~20자, 영문 + 숫자 + 특수문자(!@#$%^&*) 각 1개 이상
const PWD_REGEX =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;

// 프로필 선택
const PROFILEID_REGEX = 1<= PROFILEID_REGEX <=5



const SignUp = () => {
  const [inputEmail, setInputEmail] = usrState("");
  const [inputPwd, setInputPwd] = usrState("");
  const [inputPwdCheck, setInputPwdCheck] = usrState("");
  const [inputProfileId, setInputProfileId] = usrState("");
  const [emailStatus, setEmailStatus] = usrState("idle");

  const nav = useNavigate();

  const isEmail = EMAIL_REGEX.test(inputEmail)
  const isPwd = PWD_REGEX.test(inputPwd)
  const isPwdCheck = inputPwdCheck !== "" && inputPwd === inputPwdCheck
  const isProfileId = PROFILEID_REGEX.test(inputProfileId)

  useEffect(() => {
      if (!isEmail) {
        setEmailStatus("idle");
        return
      }

      setEmailStatus("checking")
      let ignore = false;

      const timer = settimout(async () => {
        try {
          const res = await AxiosApi.memberExist(inputEmail) ;
          if (ignore) return;
          setEmailStatus(res.data === true ? "duplicate" : "available");
        } catch (err) {
          if (!ignore) setEmailStatus("error");
        }
      }, 500);

      return () => {
        ignore=true;
        clearTimeout(timer);
      }
    }, [inputEmail, isEmail]);

    const isEmailOk = isEmail && emailStatus === "available";
    const isAllValid = isEmailOk && isPwd && isPwdCheck && isName;
  })
}