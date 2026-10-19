package in.foodos.repository;

import in.foodos.domain.Lead;
import in.foodos.domain.LeadStatus;
import in.foodos.domain.LeadType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface LeadRepository extends JpaRepository<Lead, Long>, JpaSpecificationExecutor<Lead> {

    long countByStatus(LeadStatus status);

    long countByType(LeadType type);
}
