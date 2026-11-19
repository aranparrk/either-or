
package com.eitheror.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class ImageService {

    @Value("${imgbb.api-key}")
    private String apiKey;

    private final RestClient restClient = RestClient.create();

    public String uploadImage(MultipartFile image) {

        try {
            // ImgBB에 전달할 데이터 준비
            MultiValueMap<String, Object> formData =
                    new LinkedMultiValueMap<>();

            formData.add("image", image.getResource());

            // ImgBB에 이미지 업로드 요청
            var response = restClient.post()
                    .uri("https://api.imgbb.com/1/upload?key=" + apiKey)
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .body(formData)
                    .retrieve()
                    .body(java.util.Map.class);

            // 응답에서 이미지 URL 추출
            var data = (java.util.Map<?, ?>) response.get("data");

            return data.get("url").toString();

        } catch (Exception e) {
            throw new RuntimeException("이미지 업로드에 실패했습니다.", e);
        }
    }
}
