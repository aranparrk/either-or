package com.eitheror.backend.service;

import com.eitheror.backend.dto.PollComparisonReqDto;
import com.eitheror.backend.dto.PollComparisonResDto;
import com.eitheror.backend.dto.PollDetailResDto;
import com.eitheror.backend.dto.PollOptionResDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.server.ResponseStatusException;

import java.net.http.HttpClient;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class PollComparisonService {

    private final PollService pollService;
    private final TourService tourService;
    private final RestClient restClient = RestClient.builder()
            .requestFactory(new JdkClientHttpRequestFactory(
                    HttpClient.newBuilder()
                            .version(HttpClient.Version.HTTP_1_1)
                            .build()
            ))
            .build();

    public PollComparisonResDto compare(Long pollId) {
        PollDetailResDto poll = pollService.getPollDetail(pollId);
        List<PollOptionResDto> options = poll.getOptions();

        if (options.size() != 2) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "선택지가 두 개일 때 비교할 수 있습니다."
            );
        }

        return compare(new PollComparisonReqDto(
                poll.getTitle(), options.get(0).getContent(), options.get(1).getContent(), null, null
        ));
    }

    public PollComparisonResDto compare(PollComparisonReqDto request) {
        Map<String, String> body = Map.of(
                "poll_title", request.title(),
                "option_a", request.optionA(),
                "option_b", request.optionB(),
                "option_a_overview", getTourOverview(request.contentIdA()),
                "option_b_overview", getTourOverview(request.contentIdB())
        );

        try {
            return restClient.post()
                    .uri("http://127.0.0.1:8000/compare")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .body(PollComparisonResDto.class);
        } catch (RestClientException e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY, "AI 비교 결과를 가져오지 못했습니다.", e
            );
        }
    }

    private String getTourOverview(String contentId) {
        if (contentId == null) {
            return "";
        }

        try {
            return Objects.toString(tourService.getDetail(contentId).overview(), "");
        } catch (IllegalStateException e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY, "관광지 소개를 가져오지 못했습니다.", e
            );
        }
    }
}
