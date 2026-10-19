import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormField from '../components/FormField.jsx';
import { api, auth } from '../lib/api.js';
import useDocumentTitle from '../lib/useDocumentTitle.js';

export default function AdminLogin() {
  useDocumentTitle('Admin sign in — FoodOS');
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex';
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  async function submit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const res = await api.login(email.trim(), password);
      auth.set(res.token);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="page-hero">
      <div className="container narrow">
        <h1>Admin sign in</h1>
        <form className="card" onSubmit={submit}>
          <FormField label="Email" required>
            {(p) => <input {...p} type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} />}
          </FormField>
          <FormField label="Password" required>
            {(p) => <input {...p} type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />}
          </FormField>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="btn btn-primary btn-block" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
        </form>
      </div>
    </section>
  );
}
