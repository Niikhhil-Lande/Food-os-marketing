package in.foodos.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/** Payload used by both the "Book a demo" form and the "Send an enquiry" form. */
public record LeadRequest(
        @Size(max = 120) String name,
        @Pattern(regexp = "^$|^[+0-9 ()\\-]{7,20}$", message = "must be a valid phone number")
        String whatsapp,
        @Email @Size(max = 160) String email,
        @Size(max = 160) String restaurantName,
        @NotBlank @Size(max = 60) String businessType,
        @NotBlank @Size(max = 20) String outletCount,
        @Size(max = 120) String currentPos,
        @Size(max = 2000) String message) {

    public boolean hasContactMethod() {
        return (whatsapp != null && !whatsapp.isBlank()) || (email != null && !email.isBlank());
    }
}
