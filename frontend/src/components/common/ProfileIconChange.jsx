
import { useState } from "react";
import styled from "styled-components";

import ProfileIcon from "../common/ProfileIcon.jsx";
import profile1 from "../../assets/profiles/profile1.png";
import profile2 from "../../assets/profiles/profile2.png";
import profile3 from "../../assets/profiles/profile3.png";
import profile4 from "../../assets/profiles/profile4.png";
import profile5 from "../../assets/profiles/profile5.png";

import { uploadImage } from "../../api/imgBB";

const profiles = [
  profile1,
  profile2,
  profile3,
  profile4,
  profile5
];

const ProfileSection = styled.div`
  margin-bottom: 35px;
`;

const SectionTitle = styled.p`
  font-weight: 600;
  text-align: center;
  margin-bottom: 24px;
  font-size: 20px;
  color: #333;

`;

const PreviewArea = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const PreviewImage = styled.img`
  width: 120px;
  height: 120px;
  border: 3px solid #222;
  border-radius: 50%;
  object-fit: cover;
`;

const ProfileList = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const ProfileBtn = styled.button`
  width: 52px;
  height: 52px;
  padding: 0;
  border: 3px solid ${({ $active }) =>
    $active ? "#36393b" : "#ccc"};
  border-radius: 10px;
  background: white;
  cursor: pointer;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const UploadLabel = styled.label`
  width: 52px;
  height: 52px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 3px solid #222;
  border-radius: 10px;
  font-size: 32px;
  cursor: pointer;
`;

const FileInput = styled.input`
  display: none;
`;

const ProfileIconChange = ({
  profileId,
  imageUrl,
  onProfileSelect,
  onImageUploaded
}) => {

  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  // 기본 프로필 선택
  const handleProfileSelect = (id) => {
    setPreviewUrl(null);
    onProfileSelect(id);
  };

  // 이미지 업로드
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 선택할 수 있습니다.");
      e.target.value = "";
      return;
    }

    try {
      setUploading(true);

      // 이미지 미리보기
      const localPreview = URL.createObjectURL(file);
      setPreviewUrl(localPreview);

      // ImgBB 업로드
      setPreviewUrl(null);
      const uploadedUrl = await uploadImage(file);

      // 부모 컴포넌트에 이미지 주소 전달
      onImageUploaded(uploadedUrl);

      alert("프로필 이미지가 적용되었습니다.");

    } catch (error) {
      console.error("이미지 업로드 실패:", error);
      alert("이미지 업로드에 실패했습니다.");
      setPreviewUrl(null);

    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <ProfileSection>
      <SectionTitle>프로필</SectionTitle>

      {/* 현재 선택한 프로필 미리보기 */}
      <PreviewArea>
        {previewUrl ? (
          <PreviewImage src={previewUrl} alt="프로필 미리보기" />
        ) : imageUrl ? (
          <PreviewImage src={imageUrl} alt="프로필 미리보기" />
        ) : (
          <PreviewImage
            src={profiles[(profileId || 1) - 1]}
            alt="프로필 미리보기"
          />
        )}
      </PreviewArea>

      {/* 기본 프로필 5개 */}
      <ProfileList>
        {profiles.map((image, index) => (
          <ProfileBtn
            key={index}
            type="button"
            $active={profileId === index + 1 && !imageUrl}
            onClick={() => handleProfileSelect(index + 1)}
          >
            <img src={image} alt={`프로필 ${index + 1}`} />
          </ProfileBtn>
        ))}

        {/* 이미지 업로드 버튼 */}
        <UploadLabel htmlFor="profileImage">
          {uploading ? "..." : "+"}
        </UploadLabel>

        <FileInput
          id="profileImage"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={uploading}
        />
      </ProfileList>
    </ProfileSection>
  );
};

export default ProfileIconChange;
