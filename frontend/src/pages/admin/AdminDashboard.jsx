import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../api.js';
import { Stat, Card, Modal, Field } from '../../components/ui.jsx';
import { formatMoney, statusClass } from '../../utils.js';
import { Building2, Users, FolderKanban, ListTodo, Receipt, UserCog } from 'lucide-react';

const TABS = ['overview', 'users', 'clients', 'projects', 'tasks', 'invoices'];

const EMPTY = { name: '', email: '', password: '', role: 'client', active: true };
const EMPTY_CLIENT = { company_name: '', contact_name: '', email: '', phone: '', notes: '' };
const EMPTY_PROJECT = { name: '', description: '', client_id: '', employee_id: '', status: 'planning', deadline: '' };
const EMPTY_TASK = { title: '', description: '', project_id: '', assigned_to: '', status: 'todo', due_date: '' };
const EMPTY_INVOICE = { client_id: '', project_id: '', amount: '', currency: 'USD', status: 'pending', issued_date: '', due_date: '', notes: '' };

function DashStat({ ic: Icon, label, value, hint }) {
  return (
    <div className="stat-dash">
      <div className="stat-ic"><Icon size={20} /></div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      {hint && <div className="stat-hint">{hint}</div>}
    </div>
  );
}

export default function AdminDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const pathTab = location.pathname.split('/admin/')[1] || 'overview';
  const tab = TABS.includes(pathTab) ? pathTab : 'overview';
  const setTab = (t) => navigate(t === 'overview' ? '/admin' : `/admin/${t}`);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [invoices, setInvoices] = useState([]);

  const reload = async () => {
    const [s, u, c, p, t, i] = await Promise.all([
      api.get('/admin/stats'),
      api.get('/admin/users'),
      api.get('/admin/clients'),
      api.get('/admin/projects'),
      api.get('/admin/tasks'),
      api.get('/admin/invoices')
    ]);
    setStats(s.data);
    setUsers(u.data);
    setClients(c.data);
    setProjects(p.data);
    setTasks(t.data);
    setInvoices(i.data);
  };

  useEffect(() => { reload(); }, []);

  return (
    <div className="page-pad">
      <h1>Admin Panel</h1>
      <p className="muted">Manage users, clients, projects, tasks and invoices.</p>

      <div className="tabs">
        {TABS.map((t) => (
          <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t[0].toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === 'overview' && stats && (
        <div className="stat-grid-dash">
          <DashStat ic={Building2} label="Clients" value={stats.clients} />
          <DashStat ic={Users} label="Employees" value={stats.employees} />
          <DashStat ic={FolderKanban} label="Projects" value={stats.projects} hint={`${stats.activeProjects} active`} />
          <DashStat ic={ListTodo} label="Open tasks" value={stats.openTasks} />
          <DashStat ic={Receipt} label="Outstanding" value={formatMoney(stats.invoicesOutstanding)} />
          <DashStat ic={UserCog} label="Total users" value={stats.users} />
        </div>
      )}

      {tab === 'users' && (
        <UsersTab users={users} clients={clients} projects={projects} tasks={tasks} invoices={invoices} reload={reload} />
      )}
      {tab === 'clients' && (
        <ClientsTab clients={clients} reload={reload} />
      )}
      {tab === 'projects' && (
        <ProjectsTab projects={projects} clients={clients} users={users} reload={reload} />
      )}
      {tab === 'tasks' && (
        <TasksTab tasks={tasks} projects={projects} users={users} reload={reload} />
      )}
      {tab === 'invoices' && (
        <InvoicesTab invoices={invoices} clients={clients} projects={projects} reload={reload} />
      )}
    </div>
  );
}

/* ---------------- Users ---------------- */
function UsersTab({ users, reload }) {
  const [editing, setEditing] = useState(null);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState(EMPTY);

  const open = (u) => {
    setForm(u ? { ...EMPTY, ...u, password: '' } : EMPTY);
    setEditing(u || null);
    setShow(true);
  };
  const save = async () => {
    const payload = { ...form };
    if (!payload.password) delete payload.password;
    if (editing) await api.patch(`/admin/users/${editing.id}`, payload);
    else await api.post('/admin/users', payload);
    setShow(false);
    reload();
  };
  const remove = async (id) => {
    if (!confirm('Delete this user?')) return;
    await api.delete(`/admin/users/${id}`);
    reload();
  };

  return (
    <Card title="Users" action={<button className="btn btn-primary btn-sm" onClick={() => open(null)}>+ Add</button>}>
      <table className="table">
        <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th></th></tr></thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td><td>{u.email}</td>
              <td><span className="badge">{u.role}</span></td>
              <td>{u.active ? 'Active' : 'Disabled'}</td>
              <td className="row-actions">
                <button className="btn btn-ghost btn-sm" onClick={() => open(u)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => remove(u.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal open={show} title={editing ? 'Edit user' : 'New user'} onClose={() => setShow(false)}>
        <div className="form">
          <Field label="Name"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
          <Field label="Email"><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
          <Field label="Role">
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="client">client</option>
              <option value="employee">employee</option>
              <option value="admin">admin</option>
            </select>
          </Field>
          <Field label={editing ? 'Password (leave blank to keep)' : 'Password'}>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </Field>
          {editing && (
            <Field label="Active">
              <input type="checkbox" checked={!!form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
            </Field>
          )}
          <button className="btn btn-primary" onClick={save}>Save</button>
        </div>
      </Modal>
    </Card>
  );
}

/* ---------------- Clients ---------------- */
function ClientsTab({ clients, reload }) {
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_CLIENT);

  const open = (c) => {
    setForm(c ? { ...EMPTY_CLIENT, ...c } : EMPTY_CLIENT);
    setEditing(c || null);
    setShow(true);
  };
  const save = async () => {
    if (editing) await api.patch(`/admin/clients/${editing.id}`, form);
    else await api.post('/admin/clients', form);
    setShow(false);
    reload();
  };
  const remove = async (id) => {
    if (!confirm('Delete this client?')) return;
    await api.delete(`/admin/clients/${id}`);
    reload();
  };

  return (
    <Card title="Clients" action={<button className="btn btn-primary btn-sm" onClick={() => open(null)}>+ Add</button>}>
      <table className="table">
        <thead><tr><th>Company</th><th>Contact</th><th>Email</th><th>Phone</th><th></th></tr></thead>
        <tbody>
          {clients.map((c) => (
            <tr key={c.id}>
              <td>{c.company_name}</td><td>{c.contact_name || '—'}</td>
              <td>{c.email || '—'}</td><td>{c.phone || '—'}</td>
              <td className="row-actions">
                <button className="btn btn-ghost btn-sm" onClick={() => open(c)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => remove(c.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal open={show} title={editing ? 'Edit client' : 'New client'} onClose={() => setShow(false)}>
        <div className="form">
          <Field label="Company name"><input value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} /></Field>
          <Field label="Contact name"><input value={form.contact_name} onChange={(e) => setForm({ ...form, contact_name: e.target.value })} /></Field>
          <Field label="Email"><input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
          <Field label="Phone"><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
          <Field label="Notes"><textarea rows="3" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></Field>
          <button className="btn btn-primary" onClick={save}>Save</button>
        </div>
      </Modal>
    </Card>
  );
}

/* ---------------- Projects ---------------- */
function ProjectsTab({ projects, clients, users, reload }) {
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_PROJECT);

  const open = (p) => {
    setForm(p ? { ...EMPTY_PROJECT, ...p } : EMPTY_PROJECT);
    setEditing(p || null);
    setShow(true);
  };
  const save = async () => {
    const payload = { ...form, client_id: form.client_id || null, employee_id: form.employee_id || null };
    if (editing) await api.patch(`/admin/projects/${editing.id}`, payload);
    else await api.post('/admin/projects', payload);
    setShow(false);
    reload();
  };
  const remove = async (id) => {
    if (!confirm('Delete this project?')) return;
    await api.delete(`/admin/projects/${id}`);
    reload();
  };

  return (
    <Card title="Projects" action={<button className="btn btn-primary btn-sm" onClick={() => open(null)}>+ Add</button>}>
      <table className="table">
        <thead><tr><th>Name</th><th>Client</th><th>Owner</th><th>Status</th><th>Deadline</th><th></th></tr></thead>
        <tbody>
          {projects.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td><td>{p.client_name || '—'}</td><td>{p.employee_name || '—'}</td>
              <td><span className={statusClass(p.status)}>{p.status}</span></td>
              <td>{p.deadline || '—'}</td>
              <td className="row-actions">
                <button className="btn btn-ghost btn-sm" onClick={() => open(p)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => remove(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal open={show} title={editing ? 'Edit project' : 'New project'} onClose={() => setShow(false)}>
        <div className="form">
          <Field label="Name"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
          <Field label="Description"><textarea rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
          <Field label="Client">
            <select value={form.client_id} onChange={(e) => setForm({ ...form, client_id: e.target.value })}>
              <option value="">— none —</option>
              {clients.map((c) => <option key={c.id} value={c.id}>{c.company_name}</option>)}
            </select>
          </Field>
          <Field label="Employee">
            <select value={form.employee_id} onChange={(e) => setForm({ ...form, employee_id: e.target.value })}>
              <option value="">— none —</option>
              {users.filter((u) => u.role === 'employee').map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </Field>
          <Field label="Status">
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              {['planning', 'in_progress', 'on_hold', 'completed', 'cancelled'].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Deadline"><input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} /></Field>
          <button className="btn btn-primary" onClick={save}>Save</button>
        </div>
      </Modal>
    </Card>
  );
}

/* ---------------- Tasks ---------------- */
function TasksTab({ tasks, projects, users, reload }) {
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_TASK);

  const open = (t) => {
    setForm(t ? { ...EMPTY_TASK, ...t } : EMPTY_TASK);
    setEditing(t || null);
    setShow(true);
  };
  const save = async () => {
    const payload = { ...form, project_id: form.project_id || null, assigned_to: form.assigned_to || null };
    if (editing) await api.patch(`/admin/tasks/${editing.id}`, payload);
    else await api.post('/admin/tasks', payload);
    setShow(false);
    reload();
  };
  const remove = async (id) => {
    if (!confirm('Delete this task?')) return;
    await api.delete(`/admin/tasks/${id}`);
    reload();
  };

  return (
    <Card title="Tasks" action={<button className="btn btn-primary btn-sm" onClick={() => open(null)}>+ Add</button>}>
      <table className="table">
        <thead><tr><th>Title</th><th>Project</th><th>Assignee</th><th>Status</th><th>Due</th><th></th></tr></thead>
        <tbody>
          {tasks.map((t) => (
            <tr key={t.id}>
              <td>{t.title}</td><td>{t.project_name || '—'}</td><td>{t.assignee_name || '—'}</td>
              <td><span className={statusClass(t.status)}>{t.status}</span></td>
              <td>{t.due_date || '—'}</td>
              <td className="row-actions">
                <button className="btn btn-ghost btn-sm" onClick={() => open(t)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => remove(t.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal open={show} title={editing ? 'Edit task' : 'New task'} onClose={() => setShow(false)}>
        <div className="form">
          <Field label="Title"><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
          <Field label="Description"><textarea rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
          <Field label="Project">
            <select value={form.project_id} onChange={(e) => setForm({ ...form, project_id: e.target.value })}>
              <option value="">— none —</option>
              {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </Field>
          <Field label="Assignee">
            <select value={form.assigned_to} onChange={(e) => setForm({ ...form, assigned_to: e.target.value })}>
              <option value="">— none —</option>
              {users.filter((u) => u.role === 'employee').map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </Field>
          <Field label="Status">
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              {['todo', 'in_progress', 'review', 'done'].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Due date"><input type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} /></Field>
          <button className="btn btn-primary" onClick={save}>Save</button>
        </div>
      </Modal>
    </Card>
  );
}

/* ---------------- Invoices ---------------- */
function InvoicesTab({ invoices, clients, projects, reload }) {
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_INVOICE);

  const open = (inv) => {
    setForm(inv ? { ...EMPTY_INVOICE, ...inv, amount: String(inv.amount) } : EMPTY_INVOICE);
    setEditing(inv || null);
    setShow(true);
  };
  const save = async () => {
    const payload = { ...form, client_id: form.client_id || null, project_id: form.project_id || null, amount: parseFloat(form.amount) };
    if (editing) await api.patch(`/admin/invoices/${editing.id}`, payload);
    else await api.post('/admin/invoices', payload);
    setShow(false);
    reload();
  };
  const remove = async (id) => {
    if (!confirm('Delete this invoice?')) return;
    await api.delete(`/admin/invoices/${id}`);
    reload();
  };

  return (
    <Card title="Invoices" action={<button className="btn btn-primary btn-sm" onClick={() => open(null)}>+ Add</button>}>
      <table className="table">
        <thead><tr><th>Client</th><th>Project</th><th>Amount</th><th>Status</th><th>Due</th><th></th></tr></thead>
        <tbody>
          {invoices.map((inv) => (
            <tr key={inv.id}>
              <td>{inv.client_name || '—'}</td><td>{inv.project_name || '—'}</td>
              <td>{formatMoney(inv.amount, inv.currency)}</td>
              <td><span className={statusClass(inv.status)}>{inv.status}</span></td>
              <td>{inv.due_date || '—'}</td>
              <td className="row-actions">
                <button className="btn btn-ghost btn-sm" onClick={() => open(inv)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => remove(inv.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal open={show} title={editing ? 'Edit invoice' : 'New invoice'} onClose={() => setShow(false)}>
        <div className="form">
          <Field label="Client">
            <select value={form.client_id} onChange={(e) => setForm({ ...form, client_id: e.target.value })}>
              <option value="">— select —</option>
              {clients.map((c) => <option key={c.id} value={c.id}>{c.company_name}</option>)}
            </select>
          </Field>
          <Field label="Project">
            <select value={form.project_id} onChange={(e) => setForm({ ...form, project_id: e.target.value })}>
              <option value="">— none —</option>
              {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </Field>
          <Field label="Amount"><input type="number" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} /></Field>
          <Field label="Currency"><input value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} /></Field>
          <Field label="Status">
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              {['pending', 'paid', 'overdue', 'cancelled'].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Issued date"><input type="date" value={form.issued_date} onChange={(e) => setForm({ ...form, issued_date: e.target.value })} /></Field>
          <Field label="Due date"><input type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} /></Field>
          <Field label="Notes"><textarea rows="2" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></Field>
          <button className="btn btn-primary" onClick={save}>Save</button>
        </div>
      </Modal>
    </Card>
  );
}
