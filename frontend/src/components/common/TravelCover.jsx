import styled from "styled-components";
import travelCoast from "../../assets/travel-coast.webp";

const Cover = styled.section`
  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  box-sizing: border-box;
  min-height: ${({ $wide }) => ($wide ? "244px" : "420px")};
  padding: ${({ $wide }) => ($wide ? "clamp(20px, 3vw, 32px)" : "clamp(24px, 4vw, 44px)")};
  overflow: hidden;
  border-radius: 20px;
  background: #113e39;
  color: #fff;

  &::after {
    position: absolute;
    z-index: -1;
    inset: 0;
    content: "";
    background: ${({ $wide }) => ($wide
      ? "linear-gradient(90deg, rgba(8,34,30,.9), rgba(8,34,30,.51) 54%, transparent), linear-gradient(0deg, rgba(8,34,30,.42), transparent 70%)"
      : "linear-gradient(0deg, rgba(8,34,30,.93), rgba(8,34,30,.2) 64%, transparent)")};
  }

  @media (max-width: 760px) {
    min-height: ${({ $wide }) => ($wide ? "225px" : "190px")};
    border-radius: 16px;
  }
`;

const Landscape = styled.img`
  position: absolute;
  z-index: -2;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center ${({ $wide }) => ($wide ? "36%" : "53%")};
`;

const CoverTitle = styled.h1`
  max-width: 13em;
  margin: 0;
  font-size: ${({ $wide }) => ($wide ? "clamp(27px, 4vw, 40px)" : "clamp(27px, 4.4vw, 46px)")};
  font-weight: 800;
  letter-spacing: -.045em;
  line-height: 1.15;
  word-break: keep-all;
`;

const CoverDescription = styled.p`
  max-width: 32ch;
  margin: 12px 0 0;
  color: #eff6f3;
  font-size: 15px;
  line-height: 1.55;
  word-break: keep-all;
`;

export default function TravelCover({ title, description, wide = false, children }) {
  return (
    <Cover $wide={wide}>
      <Landscape $wide={wide} src={travelCoast} alt="" fetchPriority="high" />
      <CoverTitle as={wide ? "h1" : "h2"} $wide={wide}>{title}</CoverTitle>
      <CoverDescription>{description}</CoverDescription>
      {children}
    </Cover>
  );
}
