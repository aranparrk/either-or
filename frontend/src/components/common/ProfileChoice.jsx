import styled from "styled-components";
import profile1 from "../../assets/profiles/profile1.png"
import profile2 from "../../assets/profiles/profile2.png"
import profile3 from "../../assets/profiles/profile3.png"
import profile4 from "../../assets/profiles/profile4.png"
import profile5 from "../../assets/profiles/profile5.png"

  const profiles = [
      profile1,
      profile2,
      profile3,
      profile4,
      profile5
  ];

const ProfileList = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
`;

const ProfileImage = styled.img`
  width: 55px;
  height: 55px;
  object-fit: cover;
  border-radius: 10px;
  cursor: pointer;

  border: 3px solid
    ${({ $selected }) => ($selected ? "#4b4f52" : "transparent")};

  transition: transform 0.2s, border 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;

const ProfileChoice = ({ selectedId, onSelect }) => {
  return (
    <ProfileList>
      {profiles.map((profile, index) => (
        <ProfileImage
          key={index + 1}
          src={profile}
          alt={`프로필 ${index + 1}`}
          $selected={selectedId === index + 1}
          onClick={() => onSelect(index + 1)}
        />
      ))}
    </ProfileList>
  );
};

export default ProfileChoice;