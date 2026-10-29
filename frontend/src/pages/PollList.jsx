import { useState, useEffect } from "react";
import AxiosApi from "../api/AxiosApi";
import styled from "styled-components";

const PollList = () => {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    AxiosApi.pollList()
      .then((response) => {
        setPolls(response.data);
      })
      .catch((error) => {
        console.error("투표 목록 조회 실패 : ", error);
      });
  }, []);

  return (
    <>
      {polls.map((poll) => (
        <div key={poll.pollId}>{poll.title}</div>
      ))}
    </>
  );
};

export default PollList;
