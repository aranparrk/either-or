export const saveLogin = (data) => {
  if (!data?.accessToken) {
    throw new Error("로그인 응답에 토큰이 없습니다.");
  }

  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken);
  localStorage.setItem("isLogin", "TRUE");

  if (data.email != null) {
    localStorage.setItem("email", data.email);
  } else {
    localStorage.removeItem("email");
  }

  localStorage.setItem("profileId", String(data.profileId));

  // 프로필 이미지로 변경시 이미지 주소 저장
  if (data.imageUrl) {
    localStorage.setItem("imageUrl", data.imageUrl);
  } else {
    localStorage.removeItem("imageUrl");
  }

  window.dispatchEvent(new Event("authChanged"));
};
