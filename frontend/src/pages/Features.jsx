import CtaBand from '../components/CtaBand.jsx';
import useDocumentTitle from '../lib/useDocumentTitle.js';
import { featureModules } from '../lib/content.js';

export default function Features() {
  useDocumentTitle('Features — FoodOS');
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">08 modules · one platform</p>
          <h1>Everything your restaurant needs. Nothing it doesn't.</h1>
          <p className="lead">Run your restaurant from the first order to the closing report, all from one counter.</p>
        </div>
      </section>

      <section className="section">
        <div className="container module-grid two">
          {featureModules.map((m) => (
            <article key={m.no} className="card module">
              <p className="module-label">{m.no} · {m.label}</p>
              <h2 className="h3">{m.title}</h2>
              <p>{m.text}</p>
              <ul className="ticks">
                {m.bullets.map((b) => <li key={b}>{b}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <CtaBand
        title="See it running your menu."
        text="A free 20-minute walkthrough on your restaurant's own dishes."
        label="Book a free demo"
      />
    </>
  );
}
