package com.outagetracker.controller;

import com.outagetracker.dto.OutageRequest;
import com.outagetracker.model.OutageReport;
import com.outagetracker.service.OutageService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/outages")
@CrossOrigin(origins = "http://localhost:3000")
public class OutageController {

    @Autowired
    private OutageService outageService;

    @PostMapping("/report")
    public ResponseEntity<OutageReport> reportOutage(
            @Valid @RequestBody OutageRequest request,
            Authentication authentication) {
        OutageReport report = outageService.reportOutage(request, authentication);
        return ResponseEntity.ok(report);
    }

    @GetMapping("/active")
    public ResponseEntity<List<OutageReport>> getActiveOutages(@RequestParam String pincode) {
        return ResponseEntity.ok(outageService.getActiveOutages(pincode));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OutageReport>> getAllOutages() {
        return ResponseEntity.ok(outageService.getAllOutages());
    }

    @PutMapping("/resolve/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OutageReport> resolveOutage(@PathVariable Long id) {
        return ResponseEntity.ok(outageService.resolveOutage(id));
    }
}