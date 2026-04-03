import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../components/ui/GlassCard';
import Badge from '../components/ui/Badge';
import { Search, Filter, Eye, RefreshCw, XCircle } from 'lucide-react';
import './Pages.css';

export default function JobsTable() {
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [jobs, setJobs] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [newService, setNewService] = useState('');
  const [payload, setPayload] = useState('');
  const [maxRetries, setMaxRetries] = useState(5);
  const [baseDelay, setBaseDelay] = useState(1);

  const fetchJobs = async () => {
    const res = await fetch("http://localhost:5000/jobs");
    setJobs(await res.json());
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchFailedJobs = async () => {
    const res = await fetch("http://localhost:5000/jobs/failed");
    setJobs(await res.json());
  };

  const createJob = async () => {
    if (!newService.trim()) return;

    let parsedPayload = {};
    try {
      parsedPayload = payload ? JSON.parse(payload) : {};
    } catch {
      alert("Invalid JSON payload");
      return;
    }

    await fetch("http://localhost:5000/jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        service: newService,
        payload: parsedPayload,
        maxRetries,
        baseDelay
      })
    });

    setNewService('');
    setPayload('');
    setMaxRetries(5);
    setBaseDelay(1);
    setShowModal(false);

    fetchJobs();
  };

  const handleRetry = async (id) => {
    await fetch(`http://localhost:5000/jobs/${id}/retry`, {
      method: "POST"
    });
    fetchJobs();
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/jobs/${id}`, {
      method: "DELETE"
    });
    setJobs(prev => prev.filter(j => j.id !== id));
  };

  return (
    <div className="page-container">

      <div className="page-header flex justify-between items-center w-full">
        <h1 className="text-gradient">Retry Jobs</h1>

        <div className="flex gap-4">
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            + New Job
          </button>

          <button className="btn-secondary" onClick={fetchJobs}>
            All Jobs
          </button>

          <button className="btn-secondary" onClick={fetchFailedJobs}>
            Failed Jobs
          </button>
        </div>
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
              {jobs
                .filter(j => 
                  j.id.toLowerCase().includes(search.toLowerCase()) ||
                  j.service.toLowerCase().includes(search.toLowerCase())
                )
                .map((job) => (
                  <tr key={job.id}>
                    <td className="font-mono text-sm">{job.id}</td>
                    <td>{job.service}</td>
                    <td><Badge status={job.status} /></td>
                    <td>{job.count} / 5</td>
                    <td>{job.nextRetry}</td>

                    <td>
                      <div className="flex gap-2">

                        <button 
                          className="btn-icon"
                          onClick={() => navigate(`/jobs/${job.id}`)}
                        >
                          <Eye size={18} />
                        </button>

                        <button 
                          className="btn-icon"
                          style={{ color: 'var(--status-green)' }}
                          onClick={() => handleRetry(job.id)}
                        >
                          <RefreshCw size={18} />
                        </button>

                        <button 
                          className="btn-icon"
                          style={{ color: 'var(--status-red)' }}
                          onClick={() => handleDelete(job.id)}
                        >
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

      {showModal && (
  <div className="modal-overlay">
    <div className="modal-card glass">

      <h2 className="modal-title">Create New Job</h2>

      <div className="input-group">
        <label>Service Name</label>
        <input
          type="text"
          placeholder="e.g. Payment Gateway"
          value={newService}
          onChange={(e) => setNewService(e.target.value)}
        />
      </div>

      <div className="input-group">
        <label>Payload (JSON)</label>
        <textarea
          placeholder={`{\n  "amount": 5000\n}`}
          value={payload}
          onChange={(e) => setPayload(e.target.value)}
        />
      </div>

      <div className="input-row">
        <div className="input-group">
          <label>Max Retries</label>
          <input
            type="number"
            value={maxRetries}
            onChange={(e) => setMaxRetries(parseInt(e.target.value))}
          />
        </div>

        <div className="input-group">
          <label>Base Delay (sec)</label>
          <input
            type="number"
            value={baseDelay}
            onChange={(e) => setBaseDelay(parseFloat(e.target.value))}
          />
        </div>
      </div>

      <div className="modal-actions">
        <button className="btn-secondary" onClick={() => setShowModal(false)}>
          Cancel
        </button>

        <button className="btn-primary" onClick={createJob}>
          Create Job
        </button>
      </div>

    </div>
  </div>
)}

    </div>
  );
}