package com.outagetracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class OutageTrackerBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(OutageTrackerBackendApplication.class, args);
	}

}
