package com.sentinelcore.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final JavaMailSender mailSender;

    // Send Alert Email
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

    // Send Password Reset Email
    public void sendPasswordResetEmail(
            String toEmail,
            String token) {

        SimpleMailMessage mail = new SimpleMailMessage();

        mail.setTo(toEmail);

        mail.setSubject(
                "[SentinelCore] Password Reset Request"
        );

        String resetLink =
                "http://localhost:5173/reset-password?token="
                        + token;

        String emailBody =
                "Hello,\n\n"
                        + "We received a request to reset your "
                        + "SentinelCore account password.\n\n"
                        + "Click the link below to reset your password:\n\n"
                        + resetLink
                        + "\n\n"
                        + "This password reset link will expire "
                        + "in 15 minutes.\n\n"
                        + "If you did not request a password reset, "
                        + "please ignore this email.\n\n"
                        + "Regards,\n"
                        + "SentinelCore Team";

        mail.setText(emailBody);

        mailSender.send(mail);
    }
}
