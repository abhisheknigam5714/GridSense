package com.outagetracker.repository;

import com.outagetracker.model.OutageReport;
import com.outagetracker.model.OutageStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface OutageRepository extends JpaRepository<OutageReport, Long> {
    List<OutageReport> findByPincodeAndStatus(String pincode, OutageStatus status);

    @Query("SELECT o FROM OutageReport o WHERE o.status = 'REPORTED' GROUP BY o.pincode, o.locality HAVING COUNT(o) >= 3")
    List<OutageReport> findAreasWithMultipleReports();
}