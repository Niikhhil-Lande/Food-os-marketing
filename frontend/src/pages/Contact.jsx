import { Link } from 'react-router-dom';
import LeadForm from '../components/LeadForm.jsx';
import { api } from '../lib/api.js';
import { CONTACT_EMAIL, WHATSAPP_NUMBER } from '../lib/content.js';
import useDocumentTitle from '../lib/useDocumentTitle.js';

function prettyPhone(n) {
  // 918849067601 -> +91 88490 67601 (Indian mobile format)
  const m = /^91(\d{5})(\d{5})$/.exec(n);
  return m ? `+91 ${m[1]} ${m[2]}` : `+${n}`;
}

const nextSteps = [
  ['You send a note', 'A question, a menu photo, or your current POS.'],
  ['We reply fast', 'Usually the same day on WhatsApp, and within one working day by email.'],
  ['You see it working', 'A short walkthrough on your own dishes, with pricing shown in one line.'],
];

export default function Contact() {
  useDocumentTitle('Contact — FoodOS');
  const phone = prettyPhone(WHATSAPP_NUMBER);
  const wa = `https://wa.me/${WHATSAPP_NUMBER}`;

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">We answer every message</p>
          <h1>Let's talk about your restaurant.</h1>
          <p className="lead">
            Comparing POS systems, unhappy with your current one, or just curious about billing? We're happy to help.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="channels">
            <a className="card channel" href={wa} target="_blank" rel="noopener noreferrer">
              <p className="module-label">Fastest</p>
              <h2 className="h3">Chat on WhatsApp</h2>
              <p>Talk to a person about pricing, setup, or moving your menu.</p>
              <span className="link-arrow">{phone} →</span>
            </a>
            <Link className="card channel" to="/book-a-demo">
              <p className="module-label">20 minutes</p>
              <h2 className="h3">Book a live demo</h2>
              <p>A walkthrough on your own menu.</p>
              <span className="link-arrow">Pick a time →</span>
            </Link>
            <a className="card channel" href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(CONTACT_EMAIL)}`} target="_blank" rel="noopener noreferrer">
              <p className="module-label">Replies in a day</p>
              <h2 className="h3">Write to us</h2>
              <p>For longer questions, partnerships, or multi-outlet rollouts.</p>
              <span className="link-arrow">{CONTACT_EMAIL} →</span>
            </a>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container split">
          <div>
            <h2>Send an enquiry</h2>
            <h3 className="mt">What happens next</h3>
            <ol className="plain-steps">
              {nextSteps.map(([t, d]) => (
                <li key={t}><strong>{t}.</strong> {d}</li>
              ))}
            </ol>
            <h3 className="mt">Existing customers</h3>
            <p>For billing or technical help, message support on the same WhatsApp line with your outlet name.</p>
            <a className="btn btn-ghost" href={wa} target="_blank" rel="noopener noreferrer">Message support</a>
            <p className="fine-print">Team hours: 9:00–21:00 IST, all days.</p>
          </div>
          <LeadForm
            variant="contact"
            onSubmit={api.sendEnquiry}
            submitLabel="Send enquiry"
            privacyNote="We only use your details to reply. No spam."
          />
        </div>
      </section>
    </>
  );
}
