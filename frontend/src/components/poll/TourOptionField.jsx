import { useState } from "react";
import styled from "styled-components";
import AxiosApi from "../../api/AxiosApi";
import Button from "../common/Button";
import Input from "../common/Input";
import FormFeedback from "../common/FormFeedback.jsx";

const Option = styled.fieldset`
  display: grid;
  align-content: start;
  gap: 10px;
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;

  legend {
    padding: 0;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 600;
  }

  > p {
    margin: 0;
  }
`;

const SearchForm = styled.form`
  display: flex;
  align-items: center;
  gap: 8px;

  input {
    min-width: 0;
  }

  button {
    width: auto;
    flex: 0 0 64px;
    height: 50px;
  }
`;

const Results = styled.ul`
  display: grid;
  gap: 8px;
  max-height: 280px;
  overflow-y: auto;
  list-style: none;
  margin: 0;
  padding: 0;
`;

const SelectSpot = styled.button`
  display: block;
  width: 100%;
  padding: 10px;
  text-align: left;
  font: inherit;
  color: inherit;
  background: #fafafa;
  border: 1px solid #e9e9e9;
  border-radius: 8px;
  cursor: pointer;

  &:hover, &:focus-visible {
    border-color: #76879b;
  }
`;

const SpotAddress = styled.small`
  display: block;
  color: #555;
  margin-top: 4px;
`;

const SpotImage = styled.img`
  display: block;
  width: 100%;
  height: 112px;
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: 8px;

  &[hidden] {
    display: none;
  }
`;

const Status = styled.p`
  margin: 0;
  color: #555;
  font-size: 14px;

  &:empty {
    display: none;
  }
`;

function SpotPreview({ spot }) {
  return (
    <>
      {spot.imageUrl && (
        <SpotImage
          src={spot.imageUrl}
          alt=""
          loading="lazy"
          onError={(event) => { event.currentTarget.hidden = true; }}
        />
      )}
      <strong>{spot.title}</strong>
      {spot.address && <SpotAddress>{spot.address}</SpotAddress>}
    </>
  );
}

export default function TourOptionField({ id, label, value, onChange, selected, onSelect, disabled, error }) {
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [message, setMessage] = useState("");

  async function search(event) {
    event.preventDefault();
    const query = value.trim();
    if (!query || isSearching || disabled) return;

    setIsSearching(true);
    setResults([]);
    setMessage("");
    try {
      const { data } = await AxiosApi.searchTourSpots(query);
      setResults(data);
      if (data.length === 0) setMessage("검색 결과가 없습니다.");
    } catch (error) {
      setMessage(error.response?.status === 401
        ? "관광지를 검색하려면 로그인해주세요."
        : "관광지를 검색하지 못했습니다. 다시 시도해주세요.");
    } finally {
      setIsSearching(false);
    }
  }

  return (
    <Option disabled={disabled}>
      <legend>{label}</legend>
      <SearchForm onSubmit={search}>
        <Input
          id={id}
          aria-label={`${label} 이름 또는 검색어`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          value={value}
          placeholder="이름 입력 또는 관광지 검색"
          disabled={isSearching}
          onChange={(event) => {
            onSelect(null);
            onChange(event.target.value);
            setResults([]);
            setMessage("");
          }}
        />
        <Button type="submit" size="small" enabled={Boolean(value.trim()) && !isSearching}>
          검색
        </Button>
      </SearchForm>
      <FormFeedback id={`${id}-error`}>{error}</FormFeedback>
      <Status role="status">{isSearching ? "검색 중…" : message}</Status>
      {results.length > 0 && (
        <Results aria-label={`${label} 관광지 검색 결과`}>
          {results.map((spot) => (
            <li key={spot.contentId}>
              <SelectSpot
                type="button"
                aria-label={`${spot.title} ${spot.address || ""} 선택`.trim()}
                onClick={() => {
                  onSelect(spot);
                  onChange(spot.title);
                  setResults([]);
                  setMessage(`${spot.title} 선택됨`);
                }}
              >
                <SpotPreview spot={spot} />
              </SelectSpot>
            </li>
          ))}
        </Results>
      )}
      {selected && <div key={selected.contentId}><SpotPreview spot={selected} /></div>}
    </Option>
  );
}
