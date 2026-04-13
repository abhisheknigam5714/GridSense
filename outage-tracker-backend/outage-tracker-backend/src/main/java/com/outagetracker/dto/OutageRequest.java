package com.outagetracker.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class OutageRequest {
    @NotBlank
    private String pincode;

    @NotBlank
    private String locality;

    private String description;
}