import { Link } from 'react-router-dom';

export default function CtaBand({ title, text, label = 'Book a demo' }) {
  return (
    <section className="cta-band">
      <div className="container">
        <h2>{title}</h2>
        <p>{text}</p>
        <Link to="/book-a-demo" className="btn btn-light">{label}</Link>
      </div>
    </section>
  );
}
