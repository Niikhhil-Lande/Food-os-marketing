import { describe, expect, it } from 'vitest';
import { calculateSavings, formatRupees } from './savings.js';

describe('calculateSavings', () => {
  it('reproduces the ₹18,012 figure shown on the live site', () => {
    const r = calculateSavings({ outlets: 1, annualPosCostPerOutlet: 30000, otherSoftwareCostsPerYear: 0 });
    expect(r.foodosAnnualCost).toBe(11988);
    expect(r.annualSavings).toBe(18012);
  });

  it('scales with outlets and counts half of other software', () => {
    const r = calculateSavings({ outlets: 3, annualPosCostPerOutlet: 30000, otherSoftwareCostsPerYear: 20000 });
    expect(r.annualSavings).toBe(3 * 18012 + 10000);
  });

  it('never goes negative', () => {
    const r = calculateSavings({ outlets: 1, annualPosCostPerOutlet: 0, otherSoftwareCostsPerYear: 0 });
    expect(r.annualSavings).toBe(0);
  });
});

describe('formatRupees', () => {
  it('uses Indian digit grouping', () => {
    expect(formatRupees(1234567)).toBe('₹12,34,567');
    expect(formatRupees(18012)).toBe('₹18,012');
  });
});
