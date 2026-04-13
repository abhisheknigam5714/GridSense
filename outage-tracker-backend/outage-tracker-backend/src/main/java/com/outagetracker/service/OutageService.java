package com.outagetracker.service;

import com.outagetracker.dto.OutageRequest;
import com.outagetracker.model.OutageReport;
import com.outagetracker.model.OutageStatus;
import com.outagetracker.model.User;
import com.outagetracker.repository.OutageRepository;
import com.outagetracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OutageService {

    @Autowired
    private OutageRepository outageRepository;

    @Autowired
    private UserRepository userRepository;

    public OutageReport reportOutage(OutageRequest request, Authentication authentication) {
        OutageReport report = new OutageReport();
        report.setPincode(request.getPincode());
        report.setLocality(request.getLocality());
        report.setDescription(request.getDescription());

        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElse(null);
        if (user != null) {
            report.setReporterId(user.getId());
            report.setReporterName(user.getName());
        }

        return outageRepository.save(report);
    }

    public List<OutageReport> getActiveOutages(String pincode) {
        return outageRepository.findByPincodeAndStatus(pincode, OutageStatus.REPORTED)
                .stream()
                .sorted((a, b) -> b.getReportedAt().compareTo(a.getReportedAt()))
                .toList();
    }

    public List<OutageReport> getAllOutages() {
        return outageRepository.findAll(Sort.by(Sort.Direction.DESC, "reportedAt"));
    }

    public OutageReport resolveOutage(Long id) {
        OutageReport outage = outageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Outage not found"));

        if (outage.getStatus() == OutageStatus.RESOLVED) {
            throw new RuntimeException("Outage already resolved");
        }

        outage.setStatus(OutageStatus.RESOLVED);
        outage.setResolvedAt(LocalDateTime.now());
        return outageRepository.save(outage);
    }
}