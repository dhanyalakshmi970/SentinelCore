package com.sentinelcore.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final JavaMailSender mailSender;

    public void sendAlertEmail(
            String toEmail,
            String assetName,
            String severity,
            String message) {

        SimpleMailMessage mail = new SimpleMailMessage();

        mail.setTo(toEmail);

        mail.setSubject(
                "[SentinelCore] "
                        + severity
                        + " Alert: "
                        + assetName
        );

        mail.setText(message);

        mailSender.send(mail);
    }
}