package in.foodos.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import java.time.Instant;

/** A sales lead captured from the website: either a demo booking or a contact enquiry. */
@Entity
@Table(name = "leads", indexes = {
        @Index(name = "idx_leads_created_at", columnList = "created_at"),
        @Index(name = "idx_leads_status", columnList = "status")
})
public class Lead {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private LeadType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private LeadStatus status = LeadStatus.NEW;

    @Column(length = 120)
    private String name;

    @Column(length = 30)
    private String whatsapp;

    @Column(length = 160)
    private String email;

    @Column(name = "restaurant_name", length = 160)
    private String restaurantName;

    @Column(name = "business_type", nullable = false, length = 60)
    private String businessType;

    @Column(name = "outlet_count", nullable = false, length = 20)
    private String outletCount;

    @Column(name = "current_pos", length = 120)
    private String currentPos;

    @Column(length = 2000)
    private String message;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public Long getId() { return id; }
    public LeadType getType() { return type; }
    public void setType(LeadType type) { this.type = type; }
    public LeadStatus getStatus() { return status; }
    public void setStatus(LeadStatus status) { this.status = status; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getWhatsapp() { return whatsapp; }
    public void setWhatsapp(String whatsapp) { this.whatsapp = whatsapp; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getRestaurantName() { return restaurantName; }
    public void setRestaurantName(String restaurantName) { this.restaurantName = restaurantName; }
    public String getBusinessType() { return businessType; }
    public void setBusinessType(String businessType) { this.businessType = businessType; }
    public String getOutletCount() { return outletCount; }
    public void setOutletCount(String outletCount) { this.outletCount = outletCount; }
    public String getCurrentPos() { return currentPos; }
    public void setCurrentPos(String currentPos) { this.currentPos = currentPos; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public Instant getCreatedAt() { return createdAt; }
}
