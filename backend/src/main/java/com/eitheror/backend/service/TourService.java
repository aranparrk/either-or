package com.eitheror.backend.service;

import com.eitheror.backend.dto.TourDetailResDto;
import com.eitheror.backend.dto.TourResDto;
import tools.jackson.databind.JsonNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@Transactional
public class TourService {

    private static final String SEARCH_URL =
            "https://apis.data.go.kr/B551011/KorService2/searchKeyword2";
    private static final String DETAIL_URL =
            "https://apis.data.go.kr/B551011/KorService2/detailCommon2";
    private static final String TOURIST_SPOT_TYPE = "12";

    private final RestTemplate restTemplate = new RestTemplate();
    private final String apiKey;

    public TourService(@Value("${tour.api.key}") String apiKey) {
        this.apiKey = apiKey;
    }

    public List<TourResDto> search(String keyword) {
        URI uri = UriComponentsBuilder.fromUriString(SEARCH_URL)
                .queryParam("serviceKey", "{serviceKey}")
                .queryParam("MobileOS", "ETC")
                .queryParam("MobileApp", "AppTest")
                .queryParam("keyword", "{keyword}")
                .queryParam("contentTypeId", TOURIST_SPOT_TYPE)
                .queryParam("_type", "json")
                .encode()
                .buildAndExpand(Map.of(
                        "serviceKey", apiKey,
                        "keyword", keyword
                ))
                .toUri();

        JsonNode json;
        try {
            json = restTemplate.getForObject(uri, JsonNode.class);
        } catch (RestClientException e) {
            throw new IllegalStateException("TourAPI 요청에 실패했습니다.");
        }

        if (json == null) {
            throw new IllegalStateException("TourAPI가 빈 응답을 반환했습니다.");
        }

        JsonNode response = json.path("response");
        if (!"0000".equals(response.path("header").path("resultCode").asText())) {
            throw new IllegalStateException("TourAPI가 오류를 반환했습니다.");
        }

        JsonNode body = response.path("body");
        if (body.path("totalCount").asInt(-1) == 0) {
            return List.of();
        }

        JsonNode items = body.path("items").path("item");
        if (!items.isArray()) {
            throw new IllegalStateException("TourAPI 검색 결과 형식이 올바르지 않습니다.");
        }

        List<TourResDto> results = new ArrayList<>();
        for (JsonNode item : items) {
            String contentTypeId = item.path("contenttypeid").asText();
            // The keyword search specification does not guarantee filtering by content type.
            if (!TOURIST_SPOT_TYPE.equals(contentTypeId)) {
                continue;
            }

            results.add(new TourResDto(
                    item.path("contentid").asText(),
                    item.path("title").asText(),
                    item.path("addr1").asText(),
                    item.path("firstimage").asText(),
                    contentTypeId
            ));
        }

        return results;
    }

    public TourDetailResDto getDetail(String contentId) {
        URI uri = UriComponentsBuilder.fromUriString(DETAIL_URL)
                .queryParam("serviceKey", "{serviceKey}")
                .queryParam("MobileOS", "ETC")
                .queryParam("MobileApp", "AppTest")
                .queryParam("contentId", "{contentId}")
                .queryParam("_type", "json")
                .encode()
                .buildAndExpand(Map.of(
                        "serviceKey", apiKey,
                        "contentId", contentId
                ))
                .toUri();

        JsonNode json;
        try {
            json = restTemplate.getForObject(uri, JsonNode.class);
        } catch (RestClientException e) {
            throw new IllegalStateException("TourAPI 상세정보 요청에 실패했습니다.");
        }

        if (json == null) {
            throw new IllegalStateException("TourAPI가 빈 응답을 반환했습니다.");
        }

        JsonNode response = json.path("response");
        if (!"0000".equals(response.path("header").path("resultCode").asText())) {
            throw new IllegalStateException("TourAPI가 상세정보 조회 오류를 반환했습니다.");
        }

        JsonNode itemNode = response.path("body").path("items").path("item");
        JsonNode item = itemNode.isArray() ? itemNode.path(0) : itemNode;
        if (item.isMissingNode() || item.isNull()) {
            throw new IllegalStateException("관광지 상세정보를 찾을 수 없습니다.");
        }

        return new TourDetailResDto(
                item.path("contentid").asText(contentId),
                item.path("title").asText(),
                item.path("addr1").asText(),
                item.path("overview").asText(),
                item.path("firstimage").asText()
        );
    }
}

