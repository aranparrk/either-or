package com.eitheror.backend.controller;

import com.eitheror.backend.dto.TourResDto;
import com.eitheror.backend.service.TourService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

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