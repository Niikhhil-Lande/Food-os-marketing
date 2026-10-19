package in.foodos.service;

import in.foodos.config.AppProperties;
import in.foodos.dto.SavingsRequest;
import in.foodos.dto.SavingsResponse;
import org.springframework.stereotype.Service;

/**
 * Savings estimate shown in the website calculator.
 *
 * <pre>
 * currentAnnualCost = outlets * annualPosCostPerOutlet + otherSoftwareCostsPerYear
 * foodosAnnualCost  = outlets * monthlyFee * 12
 * annualSavings     = outlets * (annualPosCostPerOutlet - monthlyFee * 12)
 *                     + otherSoftwareCostsPerYear * offsetPercent / 100
 * </pre>
 *
 * The result is never negative; the website presents it as a typical estimate, not a quote.
 */
@Service
public class SavingsService {

    private final AppProperties props;

    public SavingsService(AppProperties props) {
        this.props = props;
    }

    public SavingsResponse calculate(SavingsRequest req) {
        long foodosPerOutlet = props.getPricing().getFoodosMonthlyFee() * 12L;
        long foodosAnnual = req.outlets() * foodosPerOutlet;
        long currentAnnual = req.outlets() * req.annualPosCostPerOutlet() + req.otherSoftwareCostsPerYear();

        long posSavings = req.outlets() * (req.annualPosCostPerOutlet() - foodosPerOutlet);
        long softwareSavings = req.otherSoftwareCostsPerYear() * props.getPricing().getOtherSoftwareOffsetPercent() / 100;
        long savings = Math.max(0, posSavings + softwareSavings);

        return new SavingsResponse(req.provider().trim(), req.outlets(), currentAnnual, foodosAnnual, savings);
    }
}
