import LeadForm from '../components/LeadForm.jsx';
import { api } from '../lib/api.js';
import useDocumentTitle from '../lib/useDocumentTitle.js';

export default function BookDemo() {
  useDocumentTitle('Book a free demo — FoodOS');
  return (
    <section className="page-hero">
      <div className="container split">
        <div>
          <p className="eyebrow">Free · 20 minutes · Your menu</p>
          <h1>See FoodOS running your restaurant.</h1>
          <p className="lead">
            Share a little about your restaurant and we'll set up a walkthrough on your own dishes — billing,
            orders, inventory and WhatsApp.
          </p>
          <ul className="ticks">
            <li>Assisted setup and free menu migration if you switch</li>
            <li>Transparent ₹ pricing with no hidden modules</li>
            <li>Support from people who understand restaurants</li>
          </ul>
        </div>
        <LeadForm
          variant="demo"
          onSubmit={api.bookDemo}
          submitLabel="Book my free demo"
          privacyNote="We'll only use your details to arrange the demo. No spam, ever."
        />
      </div>
    </section>
  );
}
