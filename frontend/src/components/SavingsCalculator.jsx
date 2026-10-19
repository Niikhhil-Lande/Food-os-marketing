
import { useEffect, useRef, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import FormField from './FormField.jsx';
import { api } from '../lib/api.js';
import { calculateSavings, formatRupees } from '../lib/savings.js';
import { providers } from '../lib/content.js';

const toInt = (v) => {
  const n = parseInt(String(v).replace(/[^\d]/g, ''), 10);
  return Number.isFinite(n) ? n : 0;
};

export default function SavingsCalculator() {
  const { brand } = useOutletContext();

  const [provider, setProvider] = useState(providers[0].name);
  const [outlets, setOutlets] = useState('1');
  const [annualCost, setAnnualCost] = useState(
    String(providers[0].defaultAnnualCost)
  );
  const [otherCosts, setOtherCosts] = useState('0');

  const input = {
    outlets: Math.min(Math.max(toInt(outlets), 1), 500),
    annualPosCostPerOutlet: Math.min(toInt(annualCost), 10_000_000),
    otherSoftwareCostsPerYear: Math.min(toInt(otherCosts), 100_000_000),
  };

  const [result, setResult] = useState(() => calculateSavings(input));
  const requestId = useRef(0);

  useEffect(() => {
    setResult(calculateSavings(input));

    const id = ++requestId.current;

    const timer = setTimeout(async () => {
      try {
        const res = await api.calculateSavings({ provider, ...input });

        if (id === requestId.current) {
          setResult(res);
        }
      } catch {
        // Keep the local estimate if the server request fails.
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [
    provider,
    input.outlets,
    input.annualPosCostPerOutlet,
    input.otherSoftwareCostsPerYear,
  ]);

  function onProviderChange(e) {
    const name = e.target.value;

    setProvider(name);
    setAnnualCost(
      String(providers.find((p) => p.name === name)?.defaultAnnualCost ?? 0)
    );
  }

  return (
    <section id="savings" className="section section-alt">
      <div className="container">
        <p className="eyebrow">Savings calculator</p>

        <h2>How much could you save with {brand}?</h2>

        <p className="lead">
          Tell us about your current setup and see what switching typically
          saves in a year.
        </p>

        <div className="calc">
          <div className="card calc-inputs">
            <FormField label="Current POS provider" required>
              {(p) => (
                <select {...p} value={provider} onChange={onProviderChange}>
                  {providers.map((x) => (
                    <option key={x.name} value={x.name}>
                      {x.name}
                    </option>
                  ))}
                </select>
              )}
            </FormField>

            <FormField label="Number of outlets">
              {(p) => (
                <input
                  {...p}
                  inputMode="numeric"
                  value={outlets}
                  onChange={(e) => setOutlets(e.target.value)}
                />
              )}
            </FormField>

            <FormField label="Annual POS cost per outlet (₹)">
              {(p) => (
                <input
                  {...p}
                  inputMode="numeric"
                  value={annualCost}
                  onChange={(e) => setAnnualCost(e.target.value)}
                />
              )}
            </FormField>

            <FormField label="Other software costs (₹/yr)">
              {(p) => (
                <input
                  {...p}
                  inputMode="numeric"
                  value={otherCosts}
                  onChange={(e) => setOtherCosts(e.target.value)}
                />
              )}
            </FormField>
          </div>

          <div className="card calc-result" aria-live="polite">
            <p className="eyebrow">Your potential annual savings</p>

            <p className="calc-amount">
              {formatRupees(result.annualSavings)}
            </p>

            <p className="calc-sub">
              per year · {input.outlets} outlet
              {input.outlets > 1 ? 's' : ''} · vs. {provider}
            </p>

            <ul className="ticks">
              <li>Lower monthly subscription</li>
              <li>No extra modules or add-ons</li>
              <li>One platform — fewer tools to pay for</li>
            </ul>

            <Link
              to="/book-a-demo"
              className="btn btn-primary btn-block"
            >
              Get my {brand} offer
            </Link>

            <p className="fine-print">
              Estimate based on typical {brand} pricing vs. market averages.
              Final pricing depends on your restaurant's requirements.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
