import { Link } from 'react-router-dom';
import CtaBand from '../components/CtaBand.jsx';
import SavingsCalculator from '../components/SavingsCalculator.jsx';
import useDocumentTitle from '../lib/useDocumentTitle.js';
import { compareRows, homeModules, retentionSteps } from '../lib/content.js';

function BillMock() {
  return (
    <div className="bill" aria-hidden="true">
      <div className="bill-head"><span>Counter · Table 07</span></div>
      <div className="bill-line"><span>Paneer butter masala</span><span>₹280</span></div>
      <div className="bill-line"><span>Butter naan ×2</span><span>₹80</span></div>
      <div className="bill-line"><span>Gulab jamun</span><span>₹120</span></div>
      <div className="bill-total"><span>Total</span><span>₹480</span></div>
      <div className="bill-toast">✓ WhatsApp receipt sent to Rahul</div>
    </div>
  );
}

export default function Home() {
  useDocumentTitle('FoodOS — A simpler POS for smarter restaurants');
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <p className="eyebrow">Built for Indian kitchens</p>
            <h1>Everything your kitchen needs, nothing it doesn't.</h1>
            <p className="lead">
              Billing, orders, inventory and WhatsApp customer follow-ups in one warm, fast counter.
              ₹ pricing, no bloat, and every control within arm's reach at rush hour.
            </p>
            <div className="btn-row">
              <Link to="/book-a-demo" className="btn btn-primary">Book a free demo</Link>
              <Link to="/features" className="btn btn-ghost">Explore features</Link>
            </div>
          </div>
          <BillMock />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="module-grid">
            {homeModules.map((m) => (
              <article key={m.no} className="card module">
                <p className="module-label">{m.no} · {m.label}</p>
                <h3>{m.title}</h3>
                <p>{m.text}</p>
              </article>
            ))}
          </div>
          <p className="center"><Link to="/features" className="link-arrow">See all 8 modules →</Link></p>
        </div>
      </section>

      <section id="switch" className="section section-alt">
        <div className="container">
          <p className="eyebrow">Already have a POS?</p>
          <h2>Your POS works. But could it be simpler?</h2>
          <p className="lead">
            Most counters pay for features they never open. Here's the honest face-off — and if you switch,
            we migrate your menu and get your team ready, free.
          </p>
          <div className="table-wrap">
            <table className="compare">
              <thead>
                <tr><th scope="col">You pay for</th><th scope="col" className="hl">FoodOS</th><th scope="col">Legacy POS</th></tr>
              </thead>
              <tbody>
                {compareRows.map(([k, a, b]) => (
                  <tr key={k}><th scope="row">{k}</th><td className="hl">{a}</td><td>{b}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <Link to="/book-a-demo" className="btn btn-primary">Talk to us about switching</Link>
        </div>
      </section>

      <SavingsCalculator />

      <section className="section">
        <div className="container">
          <p className="eyebrow">Turn transactions into relationships</p>
          <h2>Your POS knows your customers. FoodOS helps bring them back.</h2>
          <ol className="steps">
            {retentionSteps.map((s, i) => (
              <li key={s.title} className="card step">
                <span className="step-no">{String(i + 1).padStart(2, '0')}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CtaBand
        title="Ready to run a calmer counter?"
        text="See FoodOS on your own menu in a 20-minute walkthrough. ₹ pricing, no lock-in."
      />
    </>
  );
}
