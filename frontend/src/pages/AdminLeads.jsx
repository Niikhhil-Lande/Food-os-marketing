import { useCallback, useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { api, auth } from '../lib/api.js';
import useDocumentTitle from '../lib/useDocumentTitle.js';

const STATUSES = ['NEW', 'CONTACTED', 'QUALIFIED', 'WON', 'LOST'];
const PAGE_SIZE = 20;

const dateFmt = new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

export default function AdminLeads() {
  useDocumentTitle('Leads — FoodOS admin');
  const navigate = useNavigate();
  const token = auth.get();

  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(0);
  const [data, setData] = useState(null);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const signOut = useCallback(() => {
    auth.clear();
    navigate('/admin/login', { replace: true });
  }, [navigate]);

  const handleError = useCallback((err) => {
    if (err.status === 401 || err.status === 403) signOut();
    else setError(err.message);
  }, [signOut]);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [leads, s] = await Promise.all([
        api.leads({ type, status, page, size: PAGE_SIZE }, token),
        api.stats(token),
      ]);
      setData(leads);
      setStats(s);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, [type, status, page, token, handleError]);

  useEffect(() => {
    if (token) load();
  }, [token, load]);

  if (!token) return <Navigate to="/admin/login" replace />;

  async function changeStatus(id, next) {
    try {
      await api.updateStatus(id, next, token);
      load();
    } catch (err) {
      handleError(err);
    }
  }

  async function remove(lead) {
    const who = lead.restaurantName || lead.name || `lead #${lead.id}`;
    if (!window.confirm(`Delete ${who}? This cannot be undone.`)) return;
    try {
      await api.deleteLead(lead.id, token);
      load();
    } catch (err) {
      handleError(err);
    }
  }

  return (
    <section className="section">
      <div className="container">
        <div className="admin-head">
          <h1 className="h2">Leads</h1>
          <button type="button" className="btn btn-ghost btn-sm" onClick={signOut}>Sign out</button>
        </div>

        {stats && (
          <div className="stat-row">
            <div className="card stat"><span>{stats.total}</span>Total</div>
            <div className="card stat"><span>{stats.demos}</span>Demo bookings</div>
            <div className="card stat"><span>{stats.enquiries}</span>Enquiries</div>
            <div className="card stat"><span>{stats.byStatus.NEW ?? 0}</span>New</div>
          </div>
        )}

        <div className="filters">
          <label>Type
            <select value={type} onChange={(e) => { setType(e.target.value); setPage(0); }}>
              <option value="">All</option>
              <option value="DEMO">Demo bookings</option>
              <option value="ENQUIRY">Enquiries</option>
            </select>
          </label>
          <label>Status
            <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(0); }}>
              <option value="">All</option>
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </label>
        </div>

        {error && <p className="form-error" role="alert">{error}</p>}

        <div className="table-wrap">
          <table className="leads">
            <thead>
              <tr>
                <th>Received</th><th>Type</th><th>Contact</th><th>Restaurant</th>
                <th>Outlets</th><th>Notes</th><th>Status</th><th><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {data?.items.map((l) => (
                <tr key={l.id}>
                  <td>{dateFmt.format(new Date(l.createdAt))}</td>
                  <td>{l.type === 'DEMO' ? 'Demo' : 'Enquiry'}</td>
                  <td>
                    {l.name && <div>{l.name}</div>}
                    {l.whatsapp && <div><a href={`https://wa.me/${l.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">{l.whatsapp}</a></div>}
                    {l.email && <div><a href={`mailto:${l.email}`}>{l.email}</a></div>}
                  </td>
                  <td>{l.restaurantName || '—'}<div className="muted">{l.businessType}</div></td>
                  <td>{l.outletCount}</td>
                  <td className="notes">{l.message || (l.currentPos ? `Current POS: ${l.currentPos}` : '—')}</td>
                  <td>
                    <select aria-label={`Status for lead ${l.id}`} value={l.status} onChange={(e) => changeStatus(l.id, e.target.value)}>
                      {STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                  <td><button type="button" className="btn btn-ghost btn-sm" onClick={() => remove(l)}>Delete</button></td>
                </tr>
              ))}
              {data && data.items.length === 0 && (
                <tr><td colSpan={8} className="center">No leads yet.</td></tr>
              )}
              {loading && !data && <tr><td colSpan={8} className="center">Loading…</td></tr>}
            </tbody>
          </table>
        </div>

        {data && data.totalPages > 1 && (
          <div className="pager">
            <button type="button" className="btn btn-ghost btn-sm" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</button>
            <span>Page {data.page + 1} of {data.totalPages}</span>
            <button type="button" className="btn btn-ghost btn-sm" disabled={page + 1 >= data.totalPages} onClick={() => setPage(page + 1)}>Next</button>
          </div>
        )}
      </div>
    </section>
  );
}
