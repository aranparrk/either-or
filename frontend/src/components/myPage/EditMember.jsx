import { useEffect, useState } from "react";
import AxiosApi from "../../api/AxiosApi.jsx";
import styled from "styled-components";
import Button from "../common/Button.jsx";
import Input from "../common/Input.jsx";
import FormFeedback from "../common/FormFeedback.jsx";
import ChangeProfile from "./ChangeProfile.jsx";
import ChangePwd from "./ChangePwd.jsx";

const Form = styled.div`
  max-width: 450px;
  margin: 0 auto;
  margin-bottom: 50px;
`;

const NicknameSection = styled.section`
  margin-bottom: 36px;
`;

const SectionTitle = styled.h3`
  margin: 0 0 24px;
  text-align: center;
  font-size: 20px;
  color: #333;
`;

const EditMember = () => {

    const [nickname, setNickname] = useState("");
    const [savedNickname, setSavedNickname] = useState(null);
    const [nicknameError, setNicknameError] = useState("");
    const [currentPwd, setCurrentPwd] = useState("");
    const [newPwd, setNewPwd] = useState("");
    const [confirmPwd, setConfirmPwd] = useState("");
    const [profileId, setProfileId] = useState(
    () => Number(localStorage.getItem("profileId") || 1)
    );
    const [profileChanged, setProfileChanged] = useState(false);
    const [saveError, setSaveError] = useState("");
    const [saved, setSaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [imageUrl, setImageUrl] = useState(
        () => localStorage.getItem("imageUrl") || ""
    );

    useEffect(() => {
        const controller = new AbortController();
        AxiosApi.memberNickname(controller.signal)
            .then(({ data }) => {
                if (controller.signal.aborted) return;
                setNickname(data.nickname);
                setSavedNickname(data.nickname);
            })
            .catch(() => {
                if (controller.signal.aborted) return;
                setSavedNickname("");
                setNicknameError("현재 닉네임을 불러오지 못했습니다.");
            });
        return () => controller.abort();
    }, []);

    const trimmedNickname = nickname.trim();
    const nicknameChanged = savedNickname !== null && trimmedNickname !== savedNickname;
    const nicknameFeedback = nicknameChanged && !trimmedNickname
        ? "닉네임을 입력해 주세요."
        : nicknameError;

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

    // 프로필을 변경 여부 확인
    const profileChange = profileChanged;

    // 회원 정보 변경
    const handleMemberUpdate = async () => {
        if (isSaving || (nicknameChanged && !trimmedNickname)) return;
        setSaveError("");
        setNicknameError("");
        setSaved(false);

        // 비밀번호를 변경 여부 확인
        const pwdChange = currentPwd || newPwd || confirmPwd;

        if (pwdChange) {
            // 비밀번호 입력칸 확인
            if (!currentPwd || !newPwd || !confirmPwd) {
                setSaveError("비밀번호 입력칸을 모두 작성해 주세요.");
                return;
            }

             // 기존 비밀번호 확인
            const checkCurrentPwd = await AxiosApi.checkCurrentPwd(currentPwd);

            if (checkCurrentPwd.data !== true) {
                setSaveError("기존 비밀번호가 일치하지 않습니다.");
                return;
            }

            // 새 비밀번호와 새비밀번호 확인 일치 확인
            if (newPwd !== confirmPwd) {
                setSaveError("새 비밀번호가 일치하지 않습니다.");
                return;
            }
        }

        // 변경할 정보가 있는지 확인
        if (!pwdChange && !profileChange && !nicknameChanged) return;

        // 회원 정보 변경 요청
        try {
            setIsSaving(true);
            const response = await AxiosApi.memberUpdate(

                // 비밀번호만 변경하거나 프로필만 변경 가능
                pwdChange ? currentPwd : undefined,
                pwdChange ? newPwd : undefined,
                profileChanged && imageUrl ? imageUrl : undefined,
                profileChanged && !imageUrl ? profileId : undefined,
                nicknameChanged ? trimmedNickname : undefined
            );

            if (response.data === true) {

                // 비밀번호 변경 후 입력칸 초기화
                setSaved(true);
                setCurrentPwd("");
                setNewPwd("");
                setConfirmPwd("");

                if (nicknameChanged) {
                    setNickname(trimmedNickname);
                    setSavedNickname(trimmedNickname);
                }

                if (profileChanged) {
                    // 기본 프로필 변경 저장
                    localStorage.setItem("profileId", profileId == null ? "" : String(profileId));

                    // 사용자 이미지 주소 저장
                    localStorage.setItem("imageUrl", imageUrl || "");

                    // 프로필 변경 후 프로필 상태 초기화
                    setProfileChanged(false);
                }

                if (nicknameChanged || profileChanged) {
                    window.dispatchEvent(new Event("authChanged"));
                }
            } else {
                setSaveError("회원 정보 변경에 실패했습니다.");
            }

        } catch (error) {
            if (nicknameChanged && error.response?.status === 409) {
                setNicknameError("이미 사용 중인 닉네임입니다.");
                return;
            }
            const message = error.response?.data?.message;
            setSaveError(typeof message === "string" && message ? message : "회원 정보 변경에 실패했습니다.");
        } finally {
            setIsSaving(false);
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
            <NicknameSection aria-labelledby="nickname-section-title">
                <SectionTitle id="nickname-section-title">
                    <label htmlFor="member-nickname">닉네임 변경</label>
                </SectionTitle>
                <Input
                    id="member-nickname"
                    autoComplete="nickname"
                    value={nickname}
                    disabled={savedNickname === null || isSaving}
                    maxLength={20}
                    aria-invalid={Boolean(nicknameFeedback)}
                    aria-describedby={nicknameFeedback ? "member-nickname-feedback" : undefined}
                    onChange={(event) => {
                        setNickname(event.target.value);
                        setNicknameError("");
                    }}
                />
                <FormFeedback id="member-nickname-feedback">{nicknameFeedback}</FormFeedback>
            </NicknameSection>
            <ChangePwd
                currentPwd={currentPwd}
                setCurrentPwd={setCurrentPwd}
                newPwd={newPwd}
                setNewPwd={setNewPwd}
                confirmPwd={confirmPwd}
                setConfirmPwd={setConfirmPwd}
            />
            <FormFeedback>{saveError}</FormFeedback>
            {saved && <FormFeedback error={false}>회원 정보를 저장했습니다.</FormFeedback>}
            <Button
                enabled={!isSaving && (!nicknameChanged || Boolean(trimmedNickname))
                    && Boolean(nicknameChanged || profileChanged || currentPwd || newPwd || confirmPwd)}
                onClick={handleMemberUpdate}
            >
                {isSaving ? "저장 중…" : "변경하기"}
            </Button>
        </Form>
    )
};

export default EditMember;
