// Local copy of the backend savings formula (SavingsService.java), used as an
// instant fallback so the calculator still works if the API is unreachable.
// Keep these constants in sync with foodos.pricing.* in backend/application.yml.
export const FOODOS_MONTHLY_FEE = 999;
export const OTHER_SOFTWARE_OFFSET_PERCENT = 50;

export function calculateSavings({ outlets, annualPosCostPerOutlet, otherSoftwareCostsPerYear }) {
  const foodosPerOutlet = FOODOS_MONTHLY_FEE * 12;
  const posSavings = outlets * (annualPosCostPerOutlet - foodosPerOutlet);
  const softwareSavings = Math.floor((otherSoftwareCostsPerYear * OTHER_SOFTWARE_OFFSET_PERCENT) / 100);
  return {
    currentAnnualCost: outlets * annualPosCostPerOutlet + otherSoftwareCostsPerYear,
    foodosAnnualCost: outlets * foodosPerOutlet,
    annualSavings: Math.max(0, posSavings + softwareSavings),
  };
}

const inr = new Intl.NumberFormat('en-IN');

export function formatRupees(n) {
  return `₹${inr.format(Math.round(n))}`;
}
