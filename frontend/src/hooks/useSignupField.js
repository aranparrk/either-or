import { useEffect, useState } from "react";
import AxiosApi from "../api/AxiosApi.jsx";

export function useSignupField(checkExists, validate) {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState("idle");
  const lookupValue = value.trim();
  const valid = validate(lookupValue);

  function changeValue(nextValue) {
    if (nextValue.trim() !== lookupValue) setStatus("checking");
    setValue(nextValue);
  }

  useEffect(() => {
    if (!valid) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const { data } = await checkExists(lookupValue, controller.signal);
        if (!controller.signal.aborted) setStatus(data ? "duplicate" : "available");
      } catch {
        if (!controller.signal.aborted) setStatus("error");
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [checkExists, lookupValue, valid]);

  return [value, changeValue, valid ? status : "idle", setStatus];
}

export function availabilityMessage(status, available, duplicate) {
  switch (status) {
    case "checking": return "중복 확인 중...";
    case "available": return available;
    case "duplicate": return duplicate;
    case "error": return "중복 확인 중 오류가 발생했습니다.";
    default: return "";
  }
}

export function useNicknameField() {
  const [value, onChange, status, setStatus] = useSignupField(
    AxiosApi.nicknameExists,
    (nickname) => nickname.length > 0 && nickname.length <= 20,
  );
  const message = value && !value.trim()
    ? "닉네임을 입력해주세요."
    : availabilityMessage(status, "사용 가능한 닉네임입니다.", "이미 사용 중인 닉네임입니다.");

  return { value, onChange, status, message, markDuplicate: () => setStatus("duplicate") };
}
