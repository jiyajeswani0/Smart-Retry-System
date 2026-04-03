import { useParams, useNavigate } from 'react-router-dom';
import GlassCard from '../components/ui/GlassCard';
import Badge from '../components/ui/Badge';
import { RefreshCw, ArrowLeft, XCircle, AlertTriangle } from 'lucide-react';
import './Pages.css';

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <div className="flex items-center gap-4 mb-6">
        <button className="btn-icon" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-gradient m-0">Job Details</h1>
        <div style={{ marginLeft: '1rem', background: 'rgba(255,255,255,0.05)', padding: '0.25rem 0.75rem', borderRadius: '4px', fontFamily: 'monospace' }}>
          {id}
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="flex-col gap-6">
          <GlassCard title="Payload Information">
            <div style={{ 
              background: 'rgba(0,0,0,0.3)', 
              padding: '1rem', 
              borderRadius: '8px', 
              fontFamily: 'monospace',
              color: '#d1d5db',
              whiteSpace: 'pre-wrap',
              overflowX: 'auto'
            }}>
{`{
  "event_type": "payment_failed",
  "customer_id": "cust_1234598",
  "amount": 4900,
  "currency": "USD",
  "gateway": "stripe",
  "metadata": {
    "order_id": "ord_x9a8f",
    "retry_attempt": 2
  }
}`}
            </div>
          </GlassCard>

          <GlassCard title="Error Logs" className="border-red-subtle">
            <div className="flex gap-2 items-start mb-2 text-red-400" style={{ color: 'var(--status-red)' }}>
              <AlertTriangle size={20} />
              <span className="font-bold">Latest Error</span>
            </div>
            <div style={{
              background: 'rgba(239, 71, 111, 0.05)',
              borderLeft: '4px solid var(--status-red)',
              padding: '1rem',
              color: 'var(--text-secondary)',
              fontFamily: 'monospace'
            }}>
              [2026-03-20T10:15:23Z] Error: Gateway Timeout (504). Upstream service failed to respond within 3000ms.
              <br/><br/>
              at PaymentService.charge (src/services/payment.js:42:15)
              <br/>
              at Worker.process (src/worker.js:105:22)
            </div>
          </GlassCard>
        </div>

        <div className="side-panel">
          <GlassCard title="Execution Summary" className="mb-6">
            <div className="flex justify-between mb-4 border-b border-white-10 pb-2 border-bottom">
              <span className="text-sub">Status</span>
              <Badge status="Retrying" />
            </div>
            <div className="flex justify-between mb-4 border-b pb-2">
              <span className="text-sub">Service</span>
              <span>Payment Gateway</span>
            </div>
            <div className="flex justify-between mb-4 border-b pb-2">
              <span className="text-sub">Attempts</span>
              <span>2 / 5</span>
            </div>
            <div className="flex justify-between mb-4 border-b pb-2">
              <span className="text-sub">Next Retry</span>
              <span>in 2 minutes</span>
            </div>

            <div className="flex gap-4 mt-6">
              <button className="btn-primary flex items-center justify-center gap-2 w-full">
                <RefreshCw size={18} /> Retry Now
              </button>
              <button className="btn-secondary w-full" style={{ borderColor: 'var(--status-red)', color: 'var(--status-red)' }}>
                Mark Failed
              </button>
            </div>
          </GlassCard>

          <GlassCard title="Retry Timeline">
            <div className="timeline">
               <div className="flex gap-4 mb-4 items-start">
                 <div style={{ color: 'var(--status-red)', marginTop: '2px' }}><XCircle size={16} /></div>
                 <div>
                   <div className="text-sm">Attempt 2</div>
                   <div className="text-sub text-xs">Today, 10:15 AM - Failed (504)</div>
                 </div>
               </div>
               <div className="flex gap-4 mb-4 items-start">
                 <div style={{ color: 'var(--status-red)', marginTop: '2px' }}><XCircle size={16} /></div>
                 <div>
                   <div className="text-sm">Attempt 1</div>
                   <div className="text-sub text-xs">Today, 10:10 AM - Failed (504)</div>
                 </div>
               </div>
               <div className="flex gap-4 items-start">
                 <div style={{ color: 'var(--text-muted)', marginTop: '2px' }}><ArrowLeft size={16} /></div>
                 <div>
                   <div className="text-sm">Initial Execution</div>
                   <div className="text-sub text-xs">Today, 10:05 AM - Triggered</div>
                 </div>
               </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
