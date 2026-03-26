import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../components/ui/GlassCard';
import Badge from '../components/ui/Badge';
import { Search, Filter, Eye, RefreshCw, XCircle } from 'lucide-react';
import './Pages.css';

const MOCK_JOBS = [
  { id: 'job-98a12f', service: 'Payment gateway', status: 'Retrying', count: 2, nextRetry: 'in 2 mins' },
  { id: 'job-4bc78d', service: 'Email delivery', status: 'Failed', count: 5, nextRetry: 'N/A' },
  { id: 'job-12x99f', service: 'Image Processing', status: 'Success', count: 1, nextRetry: '-' },
  { id: 'job-77f4xa', service: 'Payment gateway', status: 'Success', count: 3, nextRetry: '-' },
  { id: 'job-332op1', service: 'Webhook push', status: 'Retrying', count: 1, nextRetry: 'in 45 secs' },
];

export default function JobsTable() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="text-gradient">Retry Jobs</h1>
      </div>

      <GlassCard>
        <div className="flex justify-between items-center mb-6">
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by Job ID or Service..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '300px' }}
            />
          </div>
          <div className="flex gap-4">
            <select>
              <option value="all">All Statuses</option>
              <option value="retrying">Retrying</option>
              <option value="failed">Failed</option>
              <option value="success">Success</option>
            </select>
            <button className="btn-secondary flex items-center gap-2">
              <Filter size={16} /> Filter
            </button>
          </div>
        </div>

        <div className="custom-table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Job ID</th>
                <th>Service</th>
                <th>Status</th>
                <th>Retry Count</th>
                <th>Next Retry Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_JOBS.filter(j => j.id.includes(search) || j.service.toLowerCase().includes(search.toLowerCase())).map((job) => (
                <tr key={job.id}>
                  <td className="font-mono text-sm">{job.id}</td>
                  <td>{job.service}</td>
                  <td><Badge status={job.status} /></td>
                  <td>{job.count} / 5</td>
                  <td>{job.nextRetry}</td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn-icon" title="View Details" onClick={() => navigate(`/jobs/${job.id}`)}>
                        <Eye size={18} />
                      </button>
                      <button className="btn-icon" title="Retry Now" style={{ color: 'var(--status-green)' }}>
                        <RefreshCw size={18} />
                      </button>
                      <button className="btn-icon" title="Cancel Job" style={{ color: 'var(--status-red)' }}>
                        <XCircle size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
