package com.outagetracker.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "outage_reports")
@Data
public class OutageReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String pincode;

    @Column(nullable = false)
    private String locality;

    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OutageStatus status = OutageStatus.REPORTED;

    private LocalDateTime reportedAt = LocalDateTime.now();
    private LocalDateTime confirmedAt;
    private LocalDateTime resolvedAt;

    private Long reporterId;
    private String reporterName;
}