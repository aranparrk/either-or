import { useState, useEffect } from "react";
import styled from "styled-components";
import Button from "./Button.jsx";
import CancelButton from "./CancelButton.jsx"
import { uploadImage } from "../../api/imgBB.jsx";


const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Form = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const PollImage = styled.img`
  width: 100%
  max-height: 250px
  object-fit: contain;
  border-radius: 14px;
`;

const ImageUpload = ({ onImageSelect }) => {
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // 이미지 파일 선택
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      // 선택한 이미지 미리보기 주소
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      // 선택한 이미지 주소
      setImageFile(file);

      // 부모 컴포넌트에 기존 이미지 주소 초기화 요청
      onImageSelect?.(null);
    }
  };

  // 이미지 등록하기
  const handleImageUpload = async () => {

    // 이미지 유무 확인
    if (!imageFile) {
      alert("등록할 이미지를 먼저 선택해 주세요.");
      return;
    }

    try { // 이미지 등록이 성공할때
      setUploading(true);
      // ImgBB에 이미지 업로드
      const UploadedImageUrl = await uploadImage(imageFile)
      // 업로드된 이미지 주소를 부모 컴포넌트에 전달
      onImageSelect?.(UploadedImageUrl)

      alert("이미지 등록이 완료되었습니다.")

    } catch (error) { // 이미지 등록 중 오류가 발생할때
      console.error("이미지 등록 실패", error);
      alert("이미지 등록이 실패했습니다.")

    } finally { // 업로드 성공 여부와 관계없이 실행하여 등록버튼을 활성화
      setUploading(false)
    }
  };

  // 이미지 등록취소
  const handleRemoveImage = () => {
    setPreviewUrl("");
    setImageFile(null);
    onImageSelect?.(null);

    // 파일 선택창 초기화
    document.getElementById("imageInput").value = "";
  }

  return(
    <Container>
      <input
        id="imageInput"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
      />
      {previewUrl && (
        <>
          <PollImage
            src={previewUrl}
            alt="이미지"
          />
          <Form>
            <CancelButton
              enabled={!uploading}
              size="short"
              onClick={handleRemoveImage}
            >
              취소
            </CancelButton>
            <Button
              enabled={!!imageFile && !uploading}
              onClick={handleImageUpload}
              size="small"
            >
              {uploading ? "등록중..." : "사진등록"}
            </Button>
          </Form>
        </>
      )}
    </Container>
  );
}

export default ImageUpload;