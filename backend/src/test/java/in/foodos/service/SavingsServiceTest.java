package in.foodos.service;

import static org.assertj.core.api.Assertions.assertThat;

import in.foodos.config.AppProperties;
import in.foodos.dto.SavingsRequest;
import in.foodos.dto.SavingsResponse;
import org.junit.jupiter.api.Test;

class SavingsServiceTest {

    private final SavingsService service = new SavingsService(new AppProperties());

    @Test
    void defaultPetpoojaScenarioMatchesWebsiteFigure() {
        SavingsResponse r = service.calculate(new SavingsRequest("Petpooja", 1, 30_000, 0));
        assertThat(r.foodosAnnualCost()).isEqualTo(11_988);
        assertThat(r.annualSavings()).isEqualTo(18_012);
    }

    @Test
    void scalesWithOutletsAndCountsHalfOfOtherSoftware() {
        SavingsResponse r = service.calculate(new SavingsRequest("Posist", 3, 30_000, 20_000));
        assertThat(r.currentAnnualCost()).isEqualTo(110_000);
        assertThat(r.annualSavings()).isEqualTo(3 * 18_012 + 10_000);
    }

    @Test
    void neverReturnsNegativeSavings() {
        SavingsResponse r = service.calculate(new SavingsRequest("Manual billing", 1, 0, 0));
        assertThat(r.annualSavings()).isZero();
    }
}
