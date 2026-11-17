import { useState } from "react";
import AxiosApi from "../../api/AxiosApi.jsx";
import styled from "styled-components";
import Button from "../common/Button.jsx";
import ChangeProfile from "./ChangeProfile.jsx";
import ChangePwd from "./ChangePwd.jsx";

// 비밀번호 변경 영역
const Form = styled.div`
  max-width: 450px;
  margin: 0 auto;
  margin-bottom: 50px;
`;

const EditMember = () => {

    const [currentPwd, setCurrentPwd] = useState("");
    const [newPwd, setNewPwd] = useState("");
    const [confirmPwd, setConfirmPwd] = useState("");
    const [profileId, setProfileId] = useState(
    () => Number(localStorage.getItem("profileId") || 1)
    );
    const [profileChanged, setProfileChanged] = useState(false);
    const [imageUrl, setImageUrl] = useState(
        () => localStorage.getItem("imageUrl") || ""
    );

    // 기본 프로필 선택
    const handleProfileSelect = (id) => {
        setProfileId(id);
        setImageUrl("");
        setProfileChanged(true);
    }

    // 이미지 프로필 선택
    const handleImageUploaded = (url) => {
        setImageUrl(url);
        setProfileId(null);
        setProfileChanged(true);
    }

    // 회원 정보 변경
    const handleMemberUpdate = async () => {

        // 비밀번호를 변경 여부 확인
        const pwdChange = currentPwd || newPwd || confirmPwd;

        if (pwdChange) {
            if (!currentPwd || !newPwd || !confirmPwd) {
                alert("비밀번호 입력칸을 모두 작성해 주세요.");
                return;
            }

            if (newPwd !== confirmPwd) {
                alert("새 비밀번호가 일치하지 않습니다.");
                return;
            }
        }

        // 프로필을 변경 여부 확인
        const profileChange = profileChanged;

        // 변경할 정보가 있는지 확인
        if (!pwdChange && !profileChange) {
            alert("변경할 정보가 없습니다.");
            return;
        }

        // 회원 정보 변경 요청
        try {
            const response = await AxiosApi.memberUpdate(

                // 비밀번호만 변경하거나 프로필만 변경 가능
                pwdChange ? currentPwd : undefined,
                pwdChange ? newPwd : undefined,
                profileChanged && imageUrl ? imageUrl : undefined,
                profileChanged && !imageUrl ? profileId : undefined
            );

            if (response.data === true) {

                // 비밀번호 변경 후 입력칸 초기화
                alert("회원 정보가 변경되었습니다.");
                setCurrentPwd("");
                setNewPwd("");
                setConfirmPwd("");

                if (profileChanged) {
                    // 기본 프로필 변경 저장
                    localStorage.setItem("profileId", profileId == null ? "" : String(profileId));

                    // 사용자 이미지 주소 저장
                    localStorage.setItem("imageUrl", imageUrl || "");

                    // 프로필 변경 후 프로필 상태 초기화
                    setProfileChanged(false);

                    // 헤더 프로필에 변경 이벤트 알리기
                    window.dispatchEvent(new Event("authChanged"))
                }
            }

        } catch (error) {
            console.error("회원 정보 변경 오류:", error);

            const message = error.response?.data?.message;

            if (message?.includes("기존 비밀번호")) {
                alert("기존 비밀번호가 일치하지 않습니다.");
            } else {
                alert(message || "회원 정보 변경에 실패했습니다.");
            }
        }
    }

    return (
        <Form>
            <ChangeProfile
                profileId={profileId}
                imageUrl={imageUrl}
                onProfileSelect={handleProfileSelect}
                onImageUploaded={handleImageUploaded}
            />
            <ChangePwd
                currentPwd={currentPwd}
                setCurrentPwd={setCurrentPwd}
                newPwd={newPwd}
                setNewPwd={setNewPwd}
                confirmPwd={confirmPwd}
                setConfirmPwd={setConfirmPwd}
            />
            <Button
                enabled={true}
                onClick={handleMemberUpdate}
            >
                변경하기
            </Button>
        </Form>
    )
};

export default EditMember;