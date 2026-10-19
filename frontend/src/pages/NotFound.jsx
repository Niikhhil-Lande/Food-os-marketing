import { Link } from 'react-router-dom';
import useDocumentTitle from '../lib/useDocumentTitle.js';

export default function NotFound() {
  useDocumentTitle('Page not found — FoodOS');
  return (
    <section className="page-hero">
      <div className="container">
        <p className="eyebrow">404</p>
        <h1>That page isn't on the menu.</h1>
        <p className="lead">The link may be old or mistyped.</p>
        <Link to="/" className="btn btn-primary">Back to home</Link>
      </div>
    </section>
  );
}
