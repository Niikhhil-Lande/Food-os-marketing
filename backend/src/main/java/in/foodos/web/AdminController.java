package in.foodos.web;

import in.foodos.domain.LeadStatus;
import in.foodos.domain.LeadType;
import in.foodos.dto.AdminDtos.LeadPage;
import in.foodos.dto.AdminDtos.LeadStats;
import in.foodos.dto.AdminDtos.StatusUpdateRequest;
import in.foodos.dto.LeadResponse;
import in.foodos.service.LeadService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** Leads dashboard API. Every route requires a valid admin JWT. */
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final LeadService leads;

    public AdminController(LeadService leads) {
        this.leads = leads;
    }

    @GetMapping("/leads")
    public LeadPage list(@RequestParam(required = false) LeadType type,
                         @RequestParam(required = false) LeadStatus status,
                         @RequestParam(defaultValue = "0") int page,
                         @RequestParam(defaultValue = "20") int size) {
        return leads.list(type, status, page, size);
    }

    @GetMapping("/leads/stats")
    public LeadStats stats() {
        return leads.stats();
    }

    @PatchMapping("/leads/{id}/status")
    public LeadResponse updateStatus(@PathVariable Long id, @Valid @RequestBody StatusUpdateRequest req) {
        return leads.updateStatus(id, req.status());
    }

    @DeleteMapping("/leads/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        leads.delete(id);
        return ResponseEntity.noContent().build();
    }
}
