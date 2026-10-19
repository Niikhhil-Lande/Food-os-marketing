package in.foodos.service;

import in.foodos.config.AppProperties;
import in.foodos.domain.Lead;
import in.foodos.domain.LeadType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

/** Emails the sales team when a new lead arrives. Failures are logged, never thrown. */
@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    private final JavaMailSender mailSender;
    private final AppProperties props;

    public NotificationService(JavaMailSender mailSender, AppProperties props) {
        this.mailSender = mailSender;
        this.props = props;
    }

    @Async
    public void notifyNewLead(Lead lead) {
        if (!props.getNotifications().isEnabled()) {
            return;
        }
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setFrom(props.getNotifications().getFrom());
            msg.setTo(props.getNotifications().getSalesTeamTo());
            if (lead.getEmail() != null) {
                msg.setReplyTo(lead.getEmail());
            }
            msg.setSubject(subject(lead));
            msg.setText(body(lead));
            mailSender.send(msg);
        } catch (Exception e) {
            log.warn("Could not send notification for lead {}: {}", lead.getId(), e.getMessage());
        }
    }

    static String subject(Lead lead) {
        String label = lead.getType() == LeadType.DEMO ? "New demo booking" : "New enquiry";
        String who = lead.getRestaurantName() != null ? lead.getRestaurantName()
                : lead.getName() != null ? lead.getName() : "website visitor";
        // Strip line breaks so user input can never inject extra mail headers.
        return (label + ": " + who).replaceAll("[\\r\\n]+", " ");
    }

    static String body(Lead lead) {
        StringBuilder sb = new StringBuilder();
        sb.append("Type: ").append(lead.getType()).append('\n');
        line(sb, "Name", lead.getName());
        line(sb, "WhatsApp", lead.getWhatsapp());
        line(sb, "Email", lead.getEmail());
        line(sb, "Restaurant", lead.getRestaurantName());
        line(sb, "Business type", lead.getBusinessType());
        line(sb, "Outlets", lead.getOutletCount());
        line(sb, "Current POS", lead.getCurrentPos());
        line(sb, "Message", lead.getMessage());
        sb.append("Received: ").append(lead.getCreatedAt()).append('\n');
        return sb.toString();
    }

    private static void line(StringBuilder sb, String label, String value) {
        if (value != null && !value.isBlank()) {
            sb.append(label).append(": ").append(value).append('\n');
        }
    }
}
