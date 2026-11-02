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
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #d0d0d0;
`;

const ProfileIcon = () => {
    // 로그인한 맴버 프로필 아이디 가져오기
    const profileId = Number(localStorage.getItem("profileId"));
    // 프로필 아이디 번호를 기억하는 함수
    const profileImageNumber = profileImages[profileId]

  return (
    <ProfileStyled
    src={profileImageNumber}
    alt="내 프로필"
    />
  );
}

export default ProfileIcon;