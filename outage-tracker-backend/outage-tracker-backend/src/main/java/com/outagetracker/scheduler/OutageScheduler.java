package com.outagetracker.scheduler;

import com.outagetracker.model.OutageReport;
import com.outagetracker.model.OutageStatus;
import com.outagetracker.repository.OutageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class OutageScheduler {

    @Autowired
    private OutageRepository outageRepository;

    @Scheduled(fixedRate = 300000) // Every 5 minutes
    public void confirmMultipleReports() {
        var areas = outageRepository.findAreasWithMultipleReports();
        for (OutageReport outage : areas) {
            outage.setStatus(OutageStatus.CONFIRMED);
            outage.setConfirmedAt(LocalDateTime.now());
            outageRepository.save(outage);
        }
    }
}