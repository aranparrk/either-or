import { useParams } from "react-router-dom";

const PollDetail = () => {
  const { id } = useParams();

  return <div>투표 번호: {id}</div>;
};

export default PollDetail;
