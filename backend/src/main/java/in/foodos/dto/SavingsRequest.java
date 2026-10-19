package in.foodos.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SavingsRequest(
        @NotBlank @Size(max = 60) String provider,
        @Min(1) @Max(500) int outlets,
        @Min(0) @Max(10_000_000) long annualPosCostPerOutlet,
        @Min(0) @Max(100_000_000) long otherSoftwareCostsPerYear) {
}
