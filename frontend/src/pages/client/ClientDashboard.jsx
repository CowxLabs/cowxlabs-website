import { useEffect, useState } from 'react';
import api from '../../api.js';
import { Card } from '../../components/ui.jsx';
import { formatMoney, statusClass } from '../../utils.js';
import { FolderKanban, CheckCircle2, Receipt } from 'lucide-react';

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

export default function ClientDashboard() {
  const [data, setData] = useState(null);
  const [openProject, setOpenProject] = useState(null);
  const [projectTasks, setProjectTasks] = useState([]);

  const load = () => api.get('/client/dashboard').then((r) => setData(r.data));
  useEffect(() => { load(); }, []);

  const openProjectTasks = async (id) => {
    const { data } = await api.get(`/client/projects/${id}`);
    setOpenProject(data.project);
    setProjectTasks(data.tasks);
  };

  if (!data) return <div className="page-pad">Loading…</div>;

  return (
    <div className="page-pad">
      <h1>Welcome, {data.client.contact_name || data.client.company_name}</h1>
      <p className="muted">Track your projects and invoices with Cowx Labs.</p>

      <div className="stat-grid-dash">
        <DashStat ic={FolderKanban} label="Projects" value={data.stats.projects} />
        <DashStat ic={CheckCircle2} label="Active" value={data.stats.activeProjects} />
        <DashStat ic={Receipt} label="Outstanding" value={formatMoney(data.stats.outstanding)} />
      </div>

      <Card title="Your projects">
        <table className="table">
          <thead><tr><th>Name</th><th>Status</th><th>Deadline</th><th></th></tr></thead>
          <tbody>
            {data.projects.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td><span className={statusClass(p.status)}>{p.status}</span></td>
                <td>{p.deadline || '—'}</td>
                <td><button className="btn btn-ghost btn-sm" onClick={() => openProjectTasks(p.id)}>View tasks</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {openProject && (
        <Card title={`Tasks — ${openProject.name}`} action={<button className="btn btn-ghost btn-sm" onClick={() => setOpenProject(null)}>Close</button>}>
          <table className="table">
            <thead><tr><th>Task</th><th>Status</th><th>Due</th></tr></thead>
            <tbody>
              {projectTasks.map((t) => (
                <tr key={t.id}>
                  <td>{t.title}</td>
                  <td><span className={statusClass(t.status)}>{t.status}</span></td>
                  <td>{t.due_date || '—'}</td>
                </tr>
              ))}
              {projectTasks.length === 0 && <tr><td colSpan="3" className="muted">No tasks yet.</td></tr>}
            </tbody>
          </table>
        </Card>
      )}

      <Card title="Invoices">
        <table className="table">
          <thead><tr><th>Project</th><th>Amount</th><th>Status</th><th>Issued</th><th>Due</th></tr></thead>
          <tbody>
            {data.invoices.map((inv) => (
              <tr key={inv.id}>
                <td>{inv.project_name || '—'}</td>
                <td>{formatMoney(inv.amount, inv.currency)}</td>
                <td><span className={statusClass(inv.status)}>{inv.status}</span></td>
                <td>{inv.issued_date || '—'}</td>
                <td>{inv.due_date || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
