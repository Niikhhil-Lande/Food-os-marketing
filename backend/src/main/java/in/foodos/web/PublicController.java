package in.foodos.web;

import in.foodos.domain.Lead;
import in.foodos.domain.LeadType;
import in.foodos.dto.LeadRequest;
import in.foodos.dto.SavingsRequest;
import in.foodos.dto.SavingsResponse;
import in.foodos.dto.SubmissionResponse;
import in.foodos.security.RateLimiter;
import in.foodos.service.LeadService;
import in.foodos.service.SavingsService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.time.Duration;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Endpoints used by the public marketing pages. */
@RestController
@RequestMapping("/api")
public class PublicController {

    private static final int MAX_SUBMISSIONS_PER_HOUR = 10;

    private final LeadService leads;
    private final SavingsService savings;
    private final RateLimiter limiter;

    public PublicController(LeadService leads, SavingsService savings, RateLimiter limiter) {
        this.leads = leads;
        this.savings = savings;
        this.limiter = limiter;
    }

    @PostMapping("/demo-bookings")
    public ResponseEntity<SubmissionResponse> bookDemo(@Valid @RequestBody LeadRequest req, HttpServletRequest http) {
        limit(http);
        Lead lead = leads.create(LeadType.DEMO, req);
        return created(lead, "Thanks! We'll reach out shortly to set up your free 20-minute walkthrough.");
    }

    @PostMapping("/contact")
    public ResponseEntity<SubmissionResponse> contact(@Valid @RequestBody LeadRequest req, HttpServletRequest http) {
        limit(http);
        Lead lead = leads.create(LeadType.ENQUIRY, req);
        return created(lead, "Thanks! We reply the same day on WhatsApp and within one working day by email.");
    }

    @PostMapping("/savings/calculate")
    public SavingsResponse calculate(@Valid @RequestBody SavingsRequest req) {
        return savings.calculate(req);
    }

    private void limit(HttpServletRequest http) {
        limiter.check("lead:" + http.getRemoteAddr(), MAX_SUBMISSIONS_PER_HOUR, Duration.ofHours(1),
                "Too many submissions. Please try again later or message us on WhatsApp.");
    }

    private static ResponseEntity<SubmissionResponse> created(Lead lead, String message) {
        return ResponseEntity.status(HttpStatus.CREATED).body(new SubmissionResponse(lead.getId(), message));
    }
}
