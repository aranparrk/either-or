import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { saveLogin } from "../util/auth.jsx";

const SocialLoginCallback = () => {
  const nav = useNavigate();
  const requestRef = useRef(null);
  const [message, setMessage] = useState("로그인 처리 중입니다.");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;

    // StrictMode에서 effect가 다시 실행돼도 교환 요청은 한 번만 보냄
    if (!requestRef.current) {
      requestRef.current = (async () => {
        const code = new URLSearchParams(window.location.search).get("code");

        if (!code) {
          throw new Error("로그인 코드가 없습니다. 다시 로그인해 주세요.");
        }

        const csrfRes = await fetch("/api/auth/social/csrf", {
          credentials: "include",
        });

        if (!csrfRes.ok) {
          throw new Error("로그인 준비에 실패했습니다.");
        }

        const csrf = await csrfRes.json();

        const response = await fetch("/api/auth/social/login", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            [csrf.headerName]: csrf.token,
          },
          body: JSON.stringify({ code }),
        });

        if (!response.ok) {
          throw new Error(
            "로그인에 실패했습니다. 카카오 로그인을 다시 진행해 주세요."
          );
        }

        return response.json();
      })();
    }

    requestRef.current
      .then((data) => {
        if (!active) return;

        saveLogin(data);
        nav("/", { replace: true });
      })
      .catch((error) => {
        if (!active) return;

        setMessage(error.message);
        setFailed(true);
      });

    return () => {
      active = false;
    };
  }, [nav]);

  return (
    <div>
      <p role="status">{message}</p>
      {failed && <Link to="/login">로그인 화면으로</Link>}
    </div>
  );
};

export default SocialLoginCallback;
