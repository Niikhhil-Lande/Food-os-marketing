package in.foodos.service;

import in.foodos.domain.Lead;
import in.foodos.domain.LeadStatus;
import in.foodos.domain.LeadType;
import in.foodos.dto.AdminDtos.LeadPage;
import in.foodos.dto.AdminDtos.LeadStats;
import in.foodos.dto.LeadRequest;
import in.foodos.dto.LeadResponse;
import in.foodos.exception.BadRequestException;
import in.foodos.exception.NotFoundException;
import in.foodos.repository.LeadRepository;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LeadService {

    private final LeadRepository leads;
    private final NotificationService notifications;

    public LeadService(LeadRepository leads, NotificationService notifications) {
        this.leads = leads;
        this.notifications = notifications;
    }

    /** Saves a lead, then notifies the sales team. The notification never affects the response. */
    public Lead create(LeadType type, LeadRequest req) {
        if (!req.hasContactMethod()) {
            throw new BadRequestException("Please share a WhatsApp number or an email so we can reach you.");
        }
        Lead lead = new Lead();
        lead.setType(type);
        lead.setName(clean(req.name()));
        lead.setWhatsapp(clean(req.whatsapp()));
        lead.setEmail(clean(req.email()));
        lead.setRestaurantName(clean(req.restaurantName()));
        lead.setBusinessType(req.businessType().trim());
        lead.setOutletCount(req.outletCount().trim());
        lead.setCurrentPos(clean(req.currentPos()));
        lead.setMessage(clean(req.message()));

        Lead saved = leads.save(lead);
        notifications.notifyNewLead(saved);
        return saved;
    }

    @Transactional(readOnly = true)
    public LeadPage list(LeadType type, LeadStatus status, int page, int size) {
        int safeSize = Math.min(Math.max(size, 1), 100);
        int safePage = Math.max(page, 0);
        // Filters are added only when present, so no null parameters are sent to the database.
        Specification<Lead> spec = (root, query, cb) -> cb.conjunction();
        if (type != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("type"), type));
        }
        if (status != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("status"), status));
        }
        Page<Lead> result = leads.findAll(spec,
                PageRequest.of(safePage, safeSize, Sort.by(Sort.Direction.DESC, "createdAt")));
        return new LeadPage(result.getContent().stream().map(LeadResponse::from).toList(),
                result.getNumber(), result.getSize(), result.getTotalElements(), result.getTotalPages());
    }

    @Transactional
    public LeadResponse updateStatus(Long id, LeadStatus status) {
        Lead lead = leads.findById(id).orElseThrow(() -> new NotFoundException("Lead " + id + " not found"));
        lead.setStatus(status);
        return LeadResponse.from(lead);
    }

    @Transactional
    public void delete(Long id) {
        if (!leads.existsById(id)) {
            throw new NotFoundException("Lead " + id + " not found");
        }
        leads.deleteById(id);
    }

    @Transactional(readOnly = true)
    public LeadStats stats() {
        Map<String, Long> byStatus = new LinkedHashMap<>();
        for (LeadStatus s : LeadStatus.values()) {
            byStatus.put(s.name(), leads.countByStatus(s));
        }
        return new LeadStats(leads.count(), leads.countByType(LeadType.DEMO),
                leads.countByType(LeadType.ENQUIRY), byStatus);
    }

    private static String clean(String s) {
        if (s == null) {
            return null;
        }
        String t = s.trim();
        return t.isEmpty() ? null : t;
    }
}
