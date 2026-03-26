import GlassCard from '../components/ui/GlassCard';
import Badge from '../components/ui/Badge';
import { Archive, Clock, RefreshCw, XCircle } from 'lucide-react';
import './Pages.css';

const MOCK_QUEUES = [
  { name: 'Payment Queue', pending: 120, processing: 45, dql: 4 },
  { name: 'Email Queue', pending: 1540, processing: 200, dql: 12 },
  { name: 'Webhook Queue', pending: 0, processing: 2, dql: 0 },
];

export default function QueueView() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="text-gradient">Queue View</h1>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        {MOCK_QUEUES.map((q) => (
            <GlassCard key={q.name} className={q.name === 'Email Queue' ? 'border-yellow-subtle' : ''}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold flex items-center gap-2">
                        <Archive size={18} className="text-muted" /> 
                        {q.name}
                    </h3>
                </div>
                
                <div className="flex justify-between items-end">
                    <div>
                        <div className="text-sm text-sub mb-1">Pending</div>
                        <div className="text-2xl font-bold">{q.pending}</div>
                    </div>
                    <div>
                        <div className="text-sm text-sub mb-1">Processing</div>
                        <div className="text-2xl font-bold" style={{color: 'var(--status-green)'}}>{q.processing}</div>
                    </div>
                    <div style={{ background: q.dql > 0 ? 'var(--status-red-bg)' : 'transparent', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                        <div className="text-sm text-sub mb-1">DLQ (Failed)</div>
                        <div className="text-2xl font-bold" style={{color: q.dql > 0 ? 'var(--status-red)' : ''}}>{q.dql}</div>
                    </div>
                </div>
            </GlassCard>
        ))}
      </div>

      <GlassCard title="Dead Letter Queue (Failed Items)" className="border-red-subtle">
        <div className="custom-table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Job ID</th>
                <th>Original Queue</th>
                <th>Failure Reason</th>
                <th>Failed At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-mono text-sm text-sub">job-4bc78d</td>
                <td>Email Queue</td>
                <td style={{color: 'var(--status-red)'}}>SMTP Server Timeout</td>
                <td>10 mins ago</td>
                <td>
                  <div className="flex gap-2">
                    <button className="btn-icon" title="Requeue" style={{ color: 'var(--status-green)' }}>
                      <RefreshCw size={18} />
                    </button>
                    <button className="btn-icon" title="Drop" style={{ color: 'var(--status-red)' }}>
                      <XCircle size={18} />
                    </button>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="font-mono text-sm text-sub">job-99xcv1</td>
                <td>Payment Queue</td>
                <td style={{color: 'var(--status-red)'}}>Invalid Card Details</td>
                <td>1 hour ago</td>
                <td>
                  <div className="flex gap-2">
                    <button className="btn-icon" title="Requeue" style={{ color: 'var(--status-green)' }}>
                      <RefreshCw size={18} />
                    </button>
                    <button className="btn-icon" title="Drop" style={{ color: 'var(--status-red)' }}>
                      <XCircle size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
