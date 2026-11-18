import styled from "styled-components";
import profile1 from "../../assets/profiles/profile1.png"
import profile2 from "../../assets/profiles/profile2.png"
import profile3 from "../../assets/profiles/profile3.png"
import profile4 from "../../assets/profiles/profile4.png"
import profile5 from "../../assets/profiles/profile5.png"

const profileImages = {
    1: profile1,
    2: profile2,
    3: profile3,
    4: profile4,
    5: profile5,
}

const ProfileStyled = styled.img`
  box-sizing: border-box;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #d0d0d0;
`;

// 로그인 상태 헤더에 회원 프로필 띄우기
const ProfileIcon = ({ profileId, imageUrl }) => {
    // 로그인한 회원 프로필 아이디 가져오기
    const profileImage = imageUrl || profileImages[Number(profileId)] || profile1;

  return (
    <ProfileStyled
    src={profileImage}
    alt="내 프로필"
    />
  );
}

export default ProfileIcon;
