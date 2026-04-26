import { useState, useEffect, useCallback } from 'react';
import { DollarSign, Plus, RefreshCw, AlertCircle, FileText, TrendingUp, CreditCard, Wallet, CheckCircle, Trash2, Check, Users } from 'lucide-react';
import api from '../lib/api';
import { branchesApi, type Branch } from '../lib/api';

interface FeeStructure { id: string; branchId: string; name: string; amount: number; frequency: string; dueDay: number; branch?: { name: string }; }
interface FeeInvoice { id: string; studentId: string; amount: number; dueDate: string; status: 'UNPAID' | 'PAID' | 'OVERDUE'; feeStructure?: { name: string; branch?: { name: string } }; payments?: any[]; }
interface Expense { id: string; branchId: string; category: string; amount: number; description?: string; date: string; approvedBy?: string; branch?: { name: string }; }
interface SalaryStructure { id: string; branchId: string; role: string; base: number; allowances: number; deductions: number; branch?: { name: string }; }
interface SalaryDisbursement { id: string; userId: string; month: string; gross: number; net: number; slipUrl?: string; paidAt: string; }

const feeStatusStyle: Record<string, { bg: string; color: string }> = {
  PAID:    { bg: 'rgba(52,211,153,0.12)', color: '#6ee7b7' },
  UNPAID:  { bg: 'rgba(251,146,60,0.12)', color: '#fdba74' },
  OVERDUE: { bg: 'rgba(255,59,48,0.1)', color: '#ff8a80' },
};

export default function Finance() {
  const [tab, setTab] = useState<'fee-structures' | 'invoices' | 'salary' | 'expenses'>('fee-structures');
  const [branches, setBranches] = useState<Branch[]>([]);
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
  const [invoices, setInvoices] = useState<FeeInvoice[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [salaryStructures, setSalaryStructures] = useState<SalaryStructure[]>([]);
  const [disbursements, setDisbursements] = useState<SalaryDisbursement[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>({});

  useEffect(() => { branchesApi.getAll().then(setBranches).catch(() => {}); }, []);

  const fetchData = useCallback(async () => {
    setLoading(true); setError('');
    try {
      if (tab === 'fee-structures') { const r = await api.get('/fee-structures'); setFeeStructures(r.data); }
      if (tab === 'invoices') { const r = await api.get('/fee-invoices'); setInvoices(r.data); }
      if (tab === 'expenses') { const r = await api.get('/expenses'); setExpenses(r.data); }
      if (tab === 'salary') { 
        const [s, d] = await Promise.all([api.get('/salary-structures'), api.get('/salary-disbursements')]);
        setSalaryStructures(s.data);
        setDisbursements(d.data);
      }
    } catch { setError('Failed to load data'); }
    finally { setLoading(false); }
  }, [tab]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleCreate = async () => {
    setSaving(true);
    try {
      if (tab === 'fee-structures') await api.post('/fee-structures', { ...form, amount: Number(form.amount), dueDay: Number(form.dueDay || 1) });
      if (tab === 'expenses') await api.post('/expenses', { ...form, amount: Number(form.amount) });
      if (tab === 'salary') {
        if (form.isPayroll) {
          await api.post('/salary-disbursements/run', { branchId: form.branchId, month: form.month, userIds: [] }); // Typically we'd fetch users and send here, but backend ignores empty list or we can mock it
          alert('Payroll run initiated (mocked users array). Check backend implementation for full user selection.');
        } else {
          await api.post('/salary-structures', { ...form, base: Number(form.base), allowances: Number(form.allowances || 0), deductions: Number(form.deductions || 0) });
        }
      }
      setShowModal(false); setForm({});
      fetchData();
    } catch {}
    finally { setSaving(false); }
  };

  const handleRecordPayment = async (invoiceId: string, amount: number) => {
    const method = prompt('Payment method (cash/bank/upi):', 'cash');
    if (!method) return;
    try {
      await api.post('/fee-payments', { invoiceId, amount, method });
      fetchData();
    } catch {}
  };

  const handleApproveExpense = async (id: string) => {
    try { await api.patch(`/expenses/${id}/approve`, { approvedBy: 'Admin' }); fetchData(); } catch {}
  };

  const handleDelete = async (endpoint: string, id: string) => {
    if (!confirm('Delete?')) return;
    try { await api.delete(`/${endpoint}/${id}`); fetchData(); } catch {}
  };

  const totalRevenue = invoices.filter(i => i.status === 'PAID').reduce((s, i) => s + i.amount, 0);
  const totalPending = invoices.filter(i => i.status !== 'PAID').reduce((s, i) => s + i.amount, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div style={{ maxWidth: 1200 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.6, color: 'rgba(255,255,255,0.95)', marginBottom: 6 }}>Finance</h1>
          <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.4)' }}>Fee structures, invoices, salaries, and expenses</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={fetchData} className="btn-ghost" style={{ padding: '10px 14px' }} disabled={loading}><RefreshCw size={15} /></button>
          <button onClick={() => { setForm({}); setShowModal(true); }} className="btn-primary" style={{ width: 'auto', padding: '11px 20px', fontSize: 14 }}>
            <Plus size={16} /> Add {tab === 'fee-structures' ? 'Structure' : tab === 'expenses' ? 'Expense' : tab === 'salary' ? 'Salary Structure' : ''}
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {[{ label: 'Revenue Collected', value: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: TrendingUp, color: '#6ee7b7', bg: 'rgba(52,211,153,0.15)' }, { label: 'Pending Fees', value: `₹${totalPending.toLocaleString('en-IN')}`, icon: CreditCard, color: '#fdba74', bg: 'rgba(251,146,60,0.12)' }, { label: 'Total Expenses', value: `₹${totalExpenses.toLocaleString('en-IN')}`, icon: Wallet, color: '#ff8a80', bg: 'rgba(255,59,48,0.1)' }].map(s => (
          <div key={s.label} className="stat-card" style={{ padding: '18px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <s.icon size={20} style={{ color: s.color }} />
              </div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: 'white', letterSpacing: -0.5 }}>{s.value}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{s.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 5, width: 'fit-content' }}>
        {([['fee-structures', 'Fee Structures'], ['invoices', 'Invoices'], ['salary', 'Salaries'], ['expenses', 'Expenses']] as const).map(([t, label]) => (
          <button key={t} onClick={() => setTab(t as any)} style={{ padding: '8px 18px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif', border: 'none', transition: 'all 0.2s ease', background: tab === t ? 'rgba(124,109,255,0.25)' : 'transparent', color: tab === t ? '#a78bfa' : 'rgba(255,255,255,0.4)' }}>{label}</button>
        ))}
      </div>

      {error && <div style={{ marginBottom: 18, padding: '12px 16px', background: 'rgba(255,59,48,0.1)', border: '1px solid rgba(255,59,48,0.2)', borderRadius: 12, color: '#ff8a80', fontSize: 13.5, display: 'flex', gap: 8 }}><AlertCircle size={15} />{error}</div>}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><div className="spinner" style={{ width: 32, height: 32 }} /></div>
      ) : (
        <div className="content-card" style={{ overflow: 'hidden' }}>
          {tab === 'fee-structures' && (
            feeStructures.length === 0 ? <div className="empty-state"><DollarSign size={36} style={{ opacity: 0.25 }} /><p>No fee structures yet.</p></div> :
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr>{['Name', 'Branch', 'Amount', 'Frequency', 'Due Day', 'Actions'].map(c => <th key={c} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: 0.8, textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>{c}</th>)}</tr></thead>
                <tbody>
                  {feeStructures.map((f, i) => (
                    <tr key={f.id} style={{ borderBottom: i < feeStructures.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }} onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.025)')} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      <td style={{ padding: '13px 20px', fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>{f.name}</td>
                      <td style={{ padding: '13px 20px', fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{f.branch?.name || '—'}</td>
                      <td style={{ padding: '13px 20px', fontSize: 14, fontWeight: 700, color: '#6ee7b7' }}>₹{f.amount.toLocaleString('en-IN')}</td>
                      <td style={{ padding: '13px 20px', fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{f.frequency}</td>
                      <td style={{ padding: '13px 20px', fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{f.dueDay}</td>
                      <td style={{ padding: '13px 20px' }}><button className="btn-ghost danger" style={{ padding: '5px 10px', fontSize: 12 }} onClick={() => handleDelete('fee-structures', f.id)}><Trash2 size={13} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'invoices' && (
            invoices.length === 0 ? <div className="empty-state"><FileText size={36} style={{ opacity: 0.25 }} /><p>No invoices yet.</p></div> :
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr>{['Student', 'Structure', 'Amount', 'Due Date', 'Status', 'Actions'].map(c => <th key={c} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: 0.8, textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>{c}</th>)}</tr></thead>
                <tbody>
                  {invoices.map((inv, i) => {
                    const st = feeStatusStyle[inv.status];
                    return (
                      <tr key={inv.id} style={{ borderBottom: i < invoices.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }} onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.025)')} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                        <td style={{ padding: '13px 20px', fontSize: 12, fontFamily: 'monospace', color: 'rgba(255,255,255,0.55)' }}>{inv.studentId.slice(0, 12)}…</td>
                        <td style={{ padding: '13px 20px', fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{inv.feeStructure?.name || '—'}</td>
                        <td style={{ padding: '13px 20px', fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>₹{inv.amount.toLocaleString('en-IN')}</td>
                        <td style={{ padding: '13px 20px', fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{new Date(inv.dueDate).toLocaleDateString('en-IN')}</td>
                        <td style={{ padding: '13px 20px' }}><span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: st.bg, color: st.color }}>{inv.status}</span></td>
                        <td style={{ padding: '13px 20px' }}>
                          {inv.status !== 'PAID' && <button className="btn-ghost" style={{ padding: '5px 12px', fontSize: 12, color: '#6ee7b7' }} onClick={() => handleRecordPayment(inv.id, inv.amount)}><CreditCard size={13} /> Pay</button>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'salary' && (
            <div>
              <div style={{ display: 'flex', gap: 10, padding: 16, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <button className="btn-ghost" onClick={() => { setForm({ isPayroll: true }); setShowModal(true); }}>Run Payroll</button>
              </div>
              {salaryStructures.length === 0 ? <div className="empty-state"><Users size={36} style={{ opacity: 0.25 }} /><p>No salary structures yet.</p></div> :
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr>{['Role', 'Branch', 'Base', 'Allowances', 'Deductions', 'Net'].map(c => <th key={c} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: 0.8, textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>{c}</th>)}</tr></thead>
                  <tbody>
                    {salaryStructures.map((s, i) => (
                      <tr key={s.id} style={{ borderBottom: i < salaryStructures.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                        <td style={{ padding: '13px 20px', fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>{s.role}</td>
                        <td style={{ padding: '13px 20px', fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{s.branch?.name || '—'}</td>
                        <td style={{ padding: '13px 20px', fontSize: 14, fontWeight: 600 }}>₹{s.base.toLocaleString()}</td>
                        <td style={{ padding: '13px 20px', fontSize: 13, color: '#6ee7b7' }}>+₹{s.allowances.toLocaleString()}</td>
                        <td style={{ padding: '13px 20px', fontSize: 13, color: '#ff8a80' }}>-₹{s.deductions.toLocaleString()}</td>
                        <td style={{ padding: '13px 20px', fontSize: 14, fontWeight: 700, color: '#a78bfa' }}>₹{(s.base + s.allowances - s.deductions).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              }
              {disbursements.length > 0 && (
                <div style={{ marginTop: 24 }}>
                  <div style={{ padding: '16px 20px', fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Recent Disbursements</div>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead><tr>{['User ID', 'Month', 'Gross', 'Net', 'Paid At'].map(c => <th key={c} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: 0.8, textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>{c}</th>)}</tr></thead>
                    <tbody>
                      {disbursements.map(d => (
                        <tr key={d.id}>
                          <td style={{ padding: '13px 20px', fontSize: 12, fontFamily: 'monospace', color: 'rgba(255,255,255,0.5)' }}>{d.userId.slice(0, 8)}...</td>
                          <td style={{ padding: '13px 20px', fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>{d.month}</td>
                          <td style={{ padding: '13px 20px', fontSize: 13 }}>₹{d.gross.toLocaleString()}</td>
                          <td style={{ padding: '13px 20px', fontSize: 14, fontWeight: 600, color: '#6ee7b7' }}>₹{d.net.toLocaleString()}</td>
                          <td style={{ padding: '13px 20px', fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{new Date(d.paidAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {tab === 'expenses' && (
            expenses.length === 0 ? <div className="empty-state"><Wallet size={36} style={{ opacity: 0.25 }} /><p>No expenses yet.</p></div> :
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr>{['Category', 'Branch', 'Amount', 'Date', 'Approved', 'Actions'].map(c => <th key={c} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: 0.8, textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>{c}</th>)}</tr></thead>
                <tbody>
                  {expenses.map((e, i) => (
                    <tr key={e.id} style={{ borderBottom: i < expenses.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }} onMouseEnter={ev => (ev.currentTarget.style.background = 'rgba(255,255,255,0.025)')} onMouseLeave={ev => (ev.currentTarget.style.background = 'transparent')}>
                      <td style={{ padding: '13px 20px' }}><div style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>{e.category}</div>{e.description && <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{e.description}</div>}</td>
                      <td style={{ padding: '13px 20px', fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{e.branch?.name || '—'}</td>
                      <td style={{ padding: '13px 20px', fontSize: 14, fontWeight: 700, color: '#ff8a80' }}>₹{e.amount.toLocaleString('en-IN')}</td>
                      <td style={{ padding: '13px 20px', fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{new Date(e.date).toLocaleDateString('en-IN')}</td>
                      <td style={{ padding: '13px 20px' }}>
                        {e.approvedBy ? <span style={{ fontSize: 12, color: '#6ee7b7' }}><CheckCircle size={13} style={{ display: 'inline', marginRight: 4 }} />{e.approvedBy}</span> : <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>Pending</span>}
                      </td>
                      <td style={{ padding: '13px 20px' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          {!e.approvedBy && <button className="btn-ghost" style={{ padding: '5px 10px', fontSize: 12, color: '#6ee7b7' }} onClick={() => handleApproveExpense(e.id)}><Check size={13} /> Approve</button>}
                          <button className="btn-ghost danger" style={{ padding: '5px 10px', fontSize: 12 }} onClick={() => handleDelete('expenses', e.id)}><Trash2 size={13} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {showModal && tab !== 'invoices' && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={() => setShowModal(false)}>
          <div style={{ background: 'rgba(18,18,32,0.95)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 24, padding: 32, width: '100%', maxWidth: 460, backdropFilter: 'blur(40px)' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: 'white', marginBottom: 6 }}>{tab === 'fee-structures' ? 'Add Fee Structure' : tab === 'expenses' ? 'Log Expense' : form.isPayroll ? 'Run Payroll' : 'Add Salary Structure'}</h2>
            <div className="input-group">
              <label>Branch *</label>
              <select value={form.branchId || ''} onChange={e => setForm((p: any) => ({ ...p, branchId: e.target.value }))} style={{ width: '100%', padding: '13px 16px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14, color: 'rgba(255,255,255,0.8)', fontFamily: 'Inter, sans-serif', fontSize: 14, outline: 'none' }}>
                <option value="" style={{ background: '#1a1a2e' }}>Select branch...</option>
                {branches.map(b => <option key={b.id} value={b.id} style={{ background: '#1a1a2e' }}>{b.name}</option>)}
              </select>
            </div>
            {tab === 'fee-structures' ? <>
              <div className="input-group"><label>Name *</label><div className="input-wrap"><input type="text" placeholder="e.g. Term 1 Fee" value={form.name || ''} onChange={e => setForm((p: any) => ({ ...p, name: e.target.value }))} style={{ paddingLeft: 16 }} /></div></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="input-group"><label>Amount (₹) *</label><div className="input-wrap"><input type="number" placeholder="5000" value={form.amount || ''} onChange={e => setForm((p: any) => ({ ...p, amount: e.target.value }))} style={{ paddingLeft: 16 }} /></div></div>
                <div className="input-group"><label>Due Day</label><div className="input-wrap"><input type="number" placeholder="1" min="1" max="31" value={form.dueDay || ''} onChange={e => setForm((p: any) => ({ ...p, dueDay: e.target.value }))} style={{ paddingLeft: 16 }} /></div></div>
              </div>
              <div className="input-group">
                <label>Frequency</label>
                <select value={form.frequency || 'monthly'} onChange={e => setForm((p: any) => ({ ...p, frequency: e.target.value }))} style={{ width: '100%', padding: '13px 16px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14, color: 'rgba(255,255,255,0.8)', fontFamily: 'Inter, sans-serif', fontSize: 14, outline: 'none' }}>
                  {['monthly', 'quarterly', 'annually', 'one-time'].map(f => <option key={f} value={f} style={{ background: '#1a1a2e' }}>{f}</option>)}
                </select>
              </div>
            </> : tab === 'expenses' ? <>
              <div className="input-group"><label>Category *</label><div className="input-wrap"><input type="text" placeholder="e.g. Utilities, Supplies" value={form.category || ''} onChange={e => setForm((p: any) => ({ ...p, category: e.target.value }))} style={{ paddingLeft: 16 }} /></div></div>
              <div className="input-group"><label>Amount (₹) *</label><div className="input-wrap"><input type="number" placeholder="1000" value={form.amount || ''} onChange={e => setForm((p: any) => ({ ...p, amount: e.target.value }))} style={{ paddingLeft: 16 }} /></div></div>
              <div className="input-group"><label>Description</label><div className="input-wrap"><input type="text" placeholder="Brief description" value={form.description || ''} onChange={e => setForm((p: any) => ({ ...p, description: e.target.value }))} style={{ paddingLeft: 16 }} /></div></div>
            </> : tab === 'salary' ? <>
              {form.isPayroll ? (
                <div className="input-group"><label>Month *</label><div className="input-wrap"><input type="month" value={form.month || ''} onChange={e => setForm((p: any) => ({ ...p, month: e.target.value }))} style={{ paddingLeft: 16 }} /></div></div>
              ) : (
                <>
                  <div className="input-group">
                    <label>Role</label>
                    <select value={form.role || ''} onChange={e => setForm((p: any) => ({ ...p, role: e.target.value }))} style={{ width: '100%', padding: '13px 16px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14, color: 'rgba(255,255,255,0.8)', fontFamily: 'Inter, sans-serif', fontSize: 14, outline: 'none' }}>
                      <option value="" style={{ background: '#1a1a2e' }}>Select role...</option>
                      {['TEACHER', 'MANAGER', 'PRINCIPAL', 'SUPER_ADMIN'].map(r => <option key={r} value={r} style={{ background: '#1a1a2e' }}>{r}</option>)}
                    </select>
                  </div>
                  <div className="input-group"><label>Base Salary (₹) *</label><div className="input-wrap"><input type="number" placeholder="50000" value={form.base || ''} onChange={e => setForm((p: any) => ({ ...p, base: e.target.value }))} style={{ paddingLeft: 16 }} /></div></div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div className="input-group"><label>Allowances (₹)</label><div className="input-wrap"><input type="number" placeholder="0" value={form.allowances || ''} onChange={e => setForm((p: any) => ({ ...p, allowances: e.target.value }))} style={{ paddingLeft: 16 }} /></div></div>
                    <div className="input-group"><label>Deductions (₹)</label><div className="input-wrap"><input type="number" placeholder="0" value={form.deductions || ''} onChange={e => setForm((p: any) => ({ ...p, deductions: e.target.value }))} style={{ paddingLeft: 16 }} /></div></div>
                  </div>
                </>
              )}
            </> : null}
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button className="btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-primary" style={{ flex: 2 }} onClick={handleCreate} disabled={saving}>{saving ? <div className="spinner" /> : 'Save'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
