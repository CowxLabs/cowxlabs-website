import { useEffect, useState } from 'react';
import api from '../../api.js';
import { Card } from '../../components/ui.jsx';
import { statusClass } from '../../utils.js';
import { FolderKanban, CheckCircle2, ListTodo } from 'lucide-react';

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

export default function EmployeeDashboard() {
  const [data, setData] = useState(null);

  const load = () => api.get('/employee/dashboard').then((r) => setData(r.data));
  useEffect(() => { load(); }, []);

  const setStatus = async (id, status) => {
    await api.patch(`/employee/tasks/${id}/status`, { status });
    load();
  };

  if (!data) return <div className="page-pad">Loading…</div>;

  return (
    <div className="page-pad">
      <h1>My Work</h1>
      <p className="muted">Your projects and assigned tasks.</p>

      <div className="stat-grid-dash">
        <DashStat ic={FolderKanban} label="Projects" value={data.stats.projects} />
        <DashStat ic={CheckCircle2} label="Active projects" value={data.stats.activeProjects} />
        <DashStat ic={ListTodo} label="Open tasks" value={data.stats.openTasks} hint={`of ${data.stats.tasks} total`} />
      </div>

      <Card title="Assigned tasks">
        <table className="table">
          <thead><tr><th>Task</th><th>Project</th><th>Due</th><th>Status</th><th>Update</th></tr></thead>
          <tbody>
            {data.tasks.map((t) => (
              <tr key={t.id}>
                <td>{t.title}</td>
                <td>{t.project_name || '—'}</td>
                <td>{t.due_date || '—'}</td>
                <td><span className={statusClass(t.status)}>{t.status}</span></td>
                <td>
                  <select
                    className="inline-select"
                    value={t.status}
                    onChange={(e) => setStatus(t.id, e.target.value)}
                  >
                    {['todo', 'in_progress', 'review', 'done'].map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
            {data.tasks.length === 0 && (
              <tr><td colSpan="5" className="muted">No tasks assigned.</td></tr>
            )}
          </tbody>
        </table>
      </Card>

      <Card title="Projects">
        <table className="table">
          <thead><tr><th>Name</th><th>Client</th><th>Status</th><th>Deadline</th></tr></thead>
          <tbody>
            {data.projects.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.client_name || '—'}</td>
                <td><span className={statusClass(p.status)}>{p.status}</span></td>
                <td>{p.deadline || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
