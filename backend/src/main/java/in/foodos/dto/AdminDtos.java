package in.foodos.dto;

import in.foodos.domain.LeadStatus;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.Map;

public final class AdminDtos {

    private AdminDtos() {
    }

    public record StatusUpdateRequest(@NotNull LeadStatus status) {
    }

    public record LeadPage(List<LeadResponse> items, int page, int size, long totalItems, int totalPages) {
    }

    public record LeadStats(long total, long demos, long enquiries, Map<String, Long> byStatus) {
    }
}
