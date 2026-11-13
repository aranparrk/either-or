// 버튼 표시용 정보입니다. 실제 권한은 서버에서 확인합니다.
export function currentMemberId() {
  try {
    const token = localStorage.getItem("accessToken");
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return String(JSON.parse(atob(payload)).sub);
  } catch {
    return null;
  }
}
