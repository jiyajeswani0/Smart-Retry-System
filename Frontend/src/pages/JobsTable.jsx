import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../components/ui/GlassCard';
import Badge from '../components/ui/Badge';
import { Search, Eye, RefreshCw, XCircle } from 'lucide-react';
import './Pages.css';

export default function JobsTable() {
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [jobs, setJobs] = useState([]);
  const [view, setView] = useState("all");
  const [selectedJobs, setSelectedJobs] = useState([]); // ✅ NEW

  const [showModal, setShowModal] = useState(false);
  const [newService, setNewService] = useState('');
  const [payload, setPayload] = useState('');
  const [maxRetries, setMaxRetries] = useState(5);
  const [baseDelay, setBaseDelay] = useState(1);


  const fetchJobs = async () => {
    const res = await fetch("http://localhost:5000/jobs");
    setJobs(await res.json());
    setView("all");
    setSelectedJobs([]);
  };

  const fetchFailedJobs = async () => {
    const res = await fetch("http://localhost:5000/jobs/failed");
    setJobs(await res.json());
    setView("failed");
    setSelectedJobs([]);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // CREATE JOB

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
      headers: { "Content-Type": "application/json" },
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

  //  RETRY SINGLE

  const handleRetry = async (id) => {
    const endpoint =
      view === "failed"
        ? `http://localhost:5000/jobs/failed/${id}/retry`
        : `http://localhost:5000/jobs/${id}/retry`;

    await fetch(endpoint, { method: "POST" });

    view === "failed" ? fetchFailedJobs() : fetchJobs();
  };

  //RETRY ALL

  const handleRetryAllFailed = async () => {
    if (!window.confirm("Re-add all failed jobs?")) return;

    const res = await fetch("http://localhost:5000/jobs/failed/retry-all", {
      method: "POST"
    });

    const data = await res.json();
    alert(`✅ ${data.count} jobs re-added`);

    fetchJobs();
  };

  //RETRY SELECTED

  const handleRetrySelected = async () => {
    if (selectedJobs.length === 0) return;
    if (!window.confirm("Re-add selected jobs?")) return;

    const res = await fetch("http://localhost:5000/jobs/failed/retry-all", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ jobIds: selectedJobs })
    });

    const data = await res.json();
    alert(`✅ ${data.count} jobs re-added`);

    setSelectedJobs([]);
    fetchFailedJobs();
  };

  // DELETE

  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/jobs/${id}`, {
      method: "DELETE"
    });
    setJobs(prev => prev.filter(j => j.id !== id));
  };

  // UI

  return (
    <div className="page-container">

      <div className="page-header flex justify-between items-center w-full">
        <h1 className="text-gradient">Retry Jobs</h1>

        <div className="flex gap-4">

          <button className="btn-primary" onClick={() => setShowModal(true)}>
            + New Job
          </button>

          <button 
            className={view === "all" ? "btn-primary" : "btn-secondary"} 
            onClick={fetchJobs}
          >
            All Jobs
          </button>

          <button 
            className={view === "failed" ? "btn-primary" : "btn-secondary"} 
            onClick={fetchFailedJobs}
          >
            Failed Jobs
          </button>

          {view === "failed" && (
            <>
              <button 
                className="btn-primary"
                onClick={handleRetryAllFailed}
              >
                Add All Failed Jobs
              </button>

              {selectedJobs.length > 0 && (
                <button 
                  className="btn-primary"
                  onClick={handleRetrySelected}
                >
                  Re-add Selected ({selectedJobs.length})
                </button>
              )}
            </>
          )}

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
                {view === "failed" && <th>Select</th>}
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

                    {view === "failed" && (
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedJobs.includes(job.id)}
                          onChange={() => {
                            setSelectedJobs(prev =>
                              prev.includes(job.id)
                                ? prev.filter(id => id !== job.id)
                                : [...prev, job.id]
                            );
                          }}
                        />
                      </td>
                    )}

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
                          style={{ color: view === "failed" ? 'orange' : 'var(--status-green)' }}
                          onClick={() => handleRetry(job.id)}
                        >
                          <RefreshCw size={18} />
                        </button>

                        {view === "all" && (
                          <button 
                            className="btn-icon"
                            style={{ color: 'var(--status-red)' }}
                            onClick={() => handleDelete(job.id)}
                          >
                            <XCircle size={18} />
                          </button>
                        )}

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
                value={newService}
                onChange={(e) => setNewService(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>Payload (JSON)</label>
              <textarea
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
                <label>Base Delay</label>
                <input
                  type="number"
                  value={baseDelay}
                  onChange={(e) => setBaseDelay(parseFloat(e.target.value))}
                />
              </div>
            </div>

            <div className="modal-actions">
              <button onClick={() => setShowModal(false)}>Cancel</button>
              <button onClick={createJob}>Create Job</button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}