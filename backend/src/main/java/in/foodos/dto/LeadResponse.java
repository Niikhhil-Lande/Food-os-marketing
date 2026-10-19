package in.foodos.dto;

import in.foodos.domain.Lead;
import in.foodos.domain.LeadStatus;
import in.foodos.domain.LeadType;
import java.time.Instant;

public record LeadResponse(
        Long id,
        LeadType type,
        LeadStatus status,
        String name,
        String whatsapp,
        String email,
        String restaurantName,
        String businessType,
        String outletCount,
        String currentPos,
        String message,
        Instant createdAt) {

    public static LeadResponse from(Lead l) {
        return new LeadResponse(l.getId(), l.getType(), l.getStatus(), l.getName(), l.getWhatsapp(),
                l.getEmail(), l.getRestaurantName(), l.getBusinessType(), l.getOutletCount(),
                l.getCurrentPos(), l.getMessage(), l.getCreatedAt());
    }
}
