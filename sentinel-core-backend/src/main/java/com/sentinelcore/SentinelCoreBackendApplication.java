package com.sentinelcore;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
@EnableScheduling
public class SentinelCoreBackendApplication {
	public static void main(String[] args) {
		SpringApplication.run(SentinelCoreBackendApplication.class, args);
		String hashed =
				new BCryptPasswordEncoder().encode("admin123");
		System.out.println(hashed);
	}
}
