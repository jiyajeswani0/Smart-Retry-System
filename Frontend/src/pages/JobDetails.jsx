import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import GlassCard from '../components/ui/GlassCard';
import Badge from '../components/ui/Badge';
import { RefreshCw, ArrowLeft, XCircle, AlertTriangle } from 'lucide-react';
import './Pages.css';

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);

  // 🔥 Fetch job details
  useEffect(() => {
    fetch(`http://localhost:5000/jobs/${id}`)
      .then(res => res.json())
      .then(data => setJob(data));
  }, [id]);

  // 🔥 Retry
  const handleRetry = async () => {
    await fetch(`http://localhost:5000/jobs/${id}/retry`, {
      method: "POST"
    });

    // refresh
    const updated = await fetch(`http://localhost:5000/jobs/${id}`).then(r => r.json());
    setJob(updated);
  };

  if (!job) return <div className="page-container">Loading...</div>;

  return (
    <div className="page-container">
      <div className="flex items-center gap-4 mb-6">
        <button className="btn-icon" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>

        <h1 className="text-gradient m-0">Job Details</h1>

        <div style={{
          marginLeft: '1rem',
          background: 'rgba(255,255,255,0.05)',
          padding: '0.25rem 0.75rem',
          borderRadius: '4px',
          fontFamily: 'monospace'
        }}>
          {job.jobId}
        </div>
      </div>

      <div className="dashboard-grid">

        {/* LEFT SIDE */}
        <div className="flex-col gap-6">

          {/* Payload */}
          <GlassCard title="Payload Information">
            <div style={{
              background: 'rgba(0,0,0,0.3)',
              padding: '1rem',
              borderRadius: '8px',
              fontFamily: 'monospace',
              color: '#d1d5db',
              whiteSpace: 'pre-wrap',
            }}>
              {JSON.stringify(job.payload || {}, null, 2)}
            </div>
          </GlassCard>

          {/* Error Logs */}
          <GlassCard title="Error Logs" className="border-red-subtle">
            <div className="flex gap-2 items-start mb-2" style={{ color: 'var(--status-red)' }}>
              <AlertTriangle size={20} />
              <span className="font-bold">Latest Error</span>
            </div>

            {job.errorLog.length > 0 ? (
              <div style={{
                background: 'rgba(239, 71, 111, 0.05)',
                borderLeft: '4px solid var(--status-red)',
                padding: '1rem',
                fontFamily: 'monospace'
              }}>
                {job.errorLog[job.errorLog.length - 1].message}
              </div>
            ) : (
              <div className="text-sub">No errors</div>
            )}
          </GlassCard>

        </div>

        {/* RIGHT SIDE */}
        <div className="side-panel">

          {/* Summary */}
          <GlassCard title="Execution Summary" className="mb-6">

            <div className="flex justify-between mb-4 border-b pb-2">
              <span className="text-sub">Status</span>
              <Badge status={job.status} />
            </div>

            <div className="flex justify-between mb-4 border-b pb-2">
              <span className="text-sub">Service</span>
              <span>{job.service}</span>
            </div>

            <div className="flex justify-between mb-4 border-b pb-2">
              <span className="text-sub">Attempts</span>
              <span>{job.retryCount} / {job.maxRetries}</span>
            </div>

            <div className="flex justify-between mb-4 border-b pb-2">
              <span className="text-sub">Next Retry</span>
              <span>
                {job.nextRetryAt
                  ? new Date(job.nextRetryAt).toLocaleString()
                  : "N/A"}
              </span>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                className="btn-primary flex items-center justify-center gap-2 w-full"
                onClick={handleRetry}
              >
                <RefreshCw size={18} /> Retry Now
              </button>

              <button
                className="btn-secondary w-full"
                style={{ borderColor: 'var(--status-red)', color: 'var(--status-red)' }}
              >
                Mark Failed
              </button>
            </div>
          </GlassCard>

          {/* Timeline */}
          <GlassCard title="Retry Timeline">
            <div className="timeline">

              {job.timeline.slice().reverse().map((t, index) => (
                <div key={index} className="flex gap-4 mb-4 items-start">

                  <div style={{
                    color:
                      t.status === "Failed" ? "var(--status-red)" :
                      t.status === "Success" ? "var(--status-green)" :
                      "var(--text-muted)",
                    marginTop: '2px'
                  }}>
                    <XCircle size={16} />
                  </div>

                  <div>
                    <div className="text-sm">
                      Attempt {t.attempt}
                    </div>

                    <div className="text-sub text-xs">
                      {new Date(t.time).toLocaleString()} - {t.status}
                    </div>
                  </div>

                </div>
              ))}

            </div>
          </GlassCard>

        </div>
      </div>
    </div>
  );
}