import { useState } from "react";
import styled from "styled-components";
import FormFeedback from "../common/FormFeedback.jsx";

import profile1 from "../../assets/profiles/profile1.png"
import profile2 from "../../assets/profiles/profile2.png"
import profile3 from "../../assets/profiles/profile3.png"
import profile4 from "../../assets/profiles/profile4.png"
import profile5 from "../../assets/profiles/profile5.png"
import AxiosApi from "../../api/AxiosApi.jsx";


  const profiles = [
      profile1,
      profile2,
      profile3,
      profile4,
      profile5
  ];

const ProfileSection = styled.div`
  margin-bottom: 100px;
`;

const PreviewArea = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  
  p {
    font-weight: 600;
    text-align: center;
    margin-bottom: 24px;
    font-size: 20px;
    color: #333;
  }
`;

const PreviewImage = styled.img`
  width: 150px;
  height: 150px;
  border: 3px solid #d0d0d0;
  border-radius: 50%;
  object-fit: cover;
`;

const ProfileList = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  gap: 5px;
`;

const ProfileBtn = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 10px;
  cursor: pointer;

  border: 3px solid
    ${({ $active }) => ($active ? "#4b4f52" : "transparent")};

  transition: transform 0.2s, border 0.2s;

  &:hover {
    transform: scale(1.2);
  }
`;

const UploadBtn = styled.label`
  width: 57px;
  height: 57px;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 3px solid #808080;
  border-radius: 10px;
  font-size: 32px;
  color: #808080;
  cursor: pointer;
`;

const FileInput = styled.input`
  display: none;
`;


// 회원 정보 변경 프로필 바꾸기
const ChangeProfile = ({
  profileId,
  imageUrl,
  onProfileSelect,
  onImageUploaded
}) => {

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // 현재 선택한 기본 프로필
  const previewSrc = profiles[(Number(profileId ?? 1)) - 1];

  // 기본 프로필 선택
  const handleProfileSelect = (id) => {
    setUploadError("");
    onProfileSelect(id);
  };

  // 이미지 업로드
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;
    setUploadError("");

    if (!file.type.startsWith("image/")) {
      setUploadError("이미지 파일만 선택할 수 있습니다.");
      e.target.value = "";
      return;
    }

    try {
      setUploading(true);

      // 백엔드로 이미지 업로드
      const response = await AxiosApi.uploadImage(file);

      // 백엔드에서 받은 이미지 주소
      const uploadUrl = response.data.imageUrl;

      // 부모 컴포넌트에 이미지 주소 전달
      onImageUploaded(uploadUrl);

    } catch (error) {
      console.error("이미지 업로드 실패:", error);
      setUploadError("이미지 업로드에 실패했습니다.");

    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <ProfileSection>

      {/* 현재 선택한 프로필 미리보기 */}
      <PreviewArea>
       <p>프로필</p>
       <PreviewImage
          src={ imageUrl || previewSrc }
          alt="프로필 미리보기"
        />
      </PreviewArea>

      {/* 프로필 변경 하기 */}
      <ProfileList>
        {/* 기본 프로필 5개 */}
        {profiles.map((profile, index) => (
            <ProfileBtn
              key={index + 1}
              src={profile}
              alt={`프로필 ${index + 1}`}
              $active={Number(profileId) === index + 1 && !imageUrl}
              onClick={() => handleProfileSelect(index + 1)}
            />
        ))}

        {/* 이미지 프로필 업로드 + 버튼 */}
        <UploadBtn htmlFor="profileImage">
          {uploading ? "..." : "+"}
        </UploadBtn>

        <FileInput
          id="profileImage"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={uploading}
        />
      </ProfileList>
      <FormFeedback>{uploadError}</FormFeedback>

    </ProfileSection>
  );
};

export default ChangeProfile;
