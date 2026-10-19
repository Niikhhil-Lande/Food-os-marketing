package in.foodos.dto;

public record SavingsResponse(
        String provider,
        int outlets,
        long currentAnnualCost,
        long foodosAnnualCost,
        long annualSavings) {
}
