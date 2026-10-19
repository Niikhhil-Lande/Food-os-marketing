import { useState } from 'react';
import FormField from './FormField.jsx';
import { ApiError } from '../lib/api.js';
import { demoBusinessTypes, contactBusinessTypes, outletOptions } from '../lib/content.js';

const PHONE_RE = /^[+0-9 ()-]{7,20}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function emptyValues(variant) {
  return {
    name: '',
    whatsapp: '',
    email: '',
    restaurantName: '',
    businessType: variant === 'demo' ? demoBusinessTypes[0] : contactBusinessTypes[0],
    outletCount: outletOptions[0],
    currentPos: '',
    message: '',
  };
}

export function validate(values, variant) {
  const errors = {};
  const whatsapp = values.whatsapp.trim();
  const email = values.email.trim();
  if (whatsapp && !PHONE_RE.test(whatsapp)) errors.whatsapp = 'Enter a valid phone number.';
  if (email && !EMAIL_RE.test(email)) errors.email = 'Enter a valid email address.';
  if (!whatsapp && !email) {
    const msg = variant === 'demo'
      ? 'Add your WhatsApp number so we can reach you.'
      : 'Add a WhatsApp number or an email so we can reply.';
    errors[variant === 'demo' ? 'whatsapp' : 'email'] = msg;
  }
  return errors;
}

/**
 * Shared form for "Book a demo" (variant="demo") and "Send an enquiry" (variant="contact").
 * `onSubmit` receives the payload and must return a promise that resolves to { message }.
 */
export default function LeadForm({ variant, onSubmit, submitLabel, privacyNote }) {
  const [values, setValues] = useState(() => emptyValues(variant));
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(null);

  const types = variant === 'demo' ? demoBusinessTypes : contactBusinessTypes;
  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');
    const found = validate(values, variant);
    setErrors(found);
    if (Object.keys(found).length) return;

    const payload = Object.fromEntries(
      Object.entries(values)
        .filter(([key]) => (variant === 'demo' ? key !== 'email' && key !== 'message' : key !== 'currentPos'))
        .map(([k, v]) => [k, typeof v === 'string' ? v.trim() : v])
    );
    setBusy(true);
    try {
      const res = await onSubmit(payload);
      setDone(res?.message || 'Thanks! We will be in touch shortly.');
      setValues(emptyValues(variant));
    } catch (err) {
      if (err instanceof ApiError && Object.keys(err.fields).length) setErrors(err.fields);
      setFormError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="card form-success" role="status">
        <h2>You're all set.</h2>
        <p>{done}</p>
        <button type="button" className="btn btn-ghost" onClick={() => setDone(null)}>
          Send another
        </button>
      </div>
    );
  }

  return (
    <form className="card lead-form" onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <FormField label="Your name" error={errors.name}>
          {(p) => <input {...p} type="text" autoComplete="name" value={values.name} onChange={set('name')} maxLength={120} />}
        </FormField>
        <FormField label="WhatsApp number" error={errors.whatsapp}>
          {(p) => <input {...p} type="tel" autoComplete="tel" placeholder="+91" value={values.whatsapp} onChange={set('whatsapp')} />}
        </FormField>
        {variant === 'contact' && (
          <FormField label="Email" error={errors.email}>
            {(p) => <input {...p} type="email" autoComplete="email" value={values.email} onChange={set('email')} maxLength={160} />}
          </FormField>
        )}
        <FormField label="Restaurant name" error={errors.restaurantName}>
          {(p) => <input {...p} type="text" value={values.restaurantName} onChange={set('restaurantName')} maxLength={160} />}
        </FormField>
        <FormField label={variant === 'demo' ? 'Restaurant type' : 'Business type'} required error={errors.businessType}>
          {(p) => (
            <select {...p} value={values.businessType} onChange={set('businessType')}>
              {types.map((t) => <option key={t}>{t}</option>)}
            </select>
          )}
        </FormField>
        <FormField label="Number of outlets" required error={errors.outletCount}>
          {(p) => (
            <select {...p} value={values.outletCount} onChange={set('outletCount')}>
              {outletOptions.map((o) => <option key={o}>{o}</option>)}
            </select>
          )}
        </FormField>
        {variant === 'demo' && (
          <FormField label="Current POS (if any)" error={errors.currentPos}>
            {(p) => <input {...p} type="text" value={values.currentPos} onChange={set('currentPos')} maxLength={120} />}
          </FormField>
        )}
      </div>
      {variant === 'contact' && (
        <FormField label="How can we help?" error={errors.message}>
          {(p) => <textarea {...p} rows={4} value={values.message} onChange={set('message')} maxLength={2000} />}
        </FormField>
      )}

      {formError && <p className="form-error" role="alert">{formError}</p>}
      <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
        {busy ? 'Sending…' : submitLabel}
      </button>
      <p className="privacy-note">{privacyNote}</p>
    </form>
  );
}


