import { useNavigate } from "react-router-dom";
import AxiosApi from "../../api/AxiosApi";
import styled from "styled-components";

const ActionButton = styled.button`
  display: block;
  margin-left: auto;
  border: 0;
  background: transparent;
  color: #777;
  font-size: 14px;
  cursor: pointer;
  transition: color 0.15s ease;

  &:hover:not(:disabled) {
    color: #242424;
  }
`;

const Withdraw = () => {

    const nav = useNavigate();

    // 회원 탈퇴
    const handleWithdraw = async () => {
        // 탈퇴 여부 확인
        const confirmWithdraw = window.confirm(
            "정말 회원 탈퇴를 진행하시겠습니까?\n탈퇴를 하면 작성하신 게시글, 댓글 및 모든 정보가 삭제되며 복구할 수 없습니다.\n탈퇴를 원하시면 확인을 눌러주세요."
        )

        // 취소를 누르면 탈퇴 취소
        if (!confirmWithdraw) {
            return
        }

        // 확인을 누르면 탈퇴 진행
        try {
            await AxiosApi.memberWithdraw();

            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("isLogin");
            localStorage.removeItem("email");
            localStorage.removeItem("profileId");
            localStorage.removeItem("imageUrl");

            // 탈퇴 상태 변경 알림
            window.dispatchEvent(new Event("authChanged"))
            alert("회원 탈퇴가 완료되었습니다.")
            nav("/login", { replace: true });

        } catch (error) {
            console.error("회원탈퇴 실패:", error);
            alert("회원탈퇴에 실패했습니다. 다시 시도해주세요.");
        }
    };

    return (
        <ActionButton onClick={handleWithdraw}>
            회원탈퇴
        </ActionButton>
    )
}

export default Withdraw;
