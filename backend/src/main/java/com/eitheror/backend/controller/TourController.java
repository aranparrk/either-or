package com.eitheror.backend.controller;

import com.eitheror.backend.dto.TourResDto;
import com.eitheror.backend.service.TourService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "외부 API", description = "한국관광공사 API")
@Slf4j
@RestController
public class TourController {

    private final TourService tourService;


    public TourController(TourService tourService) {
        this.tourService = tourService;
    }

    @GetMapping("/api/tour-spots")
    public List<TourResDto> search(@RequestParam("keyword") String keyword) {
        return tourService.search(keyword);
    }
}