import GlassCard from '../components/ui/GlassCard';
import './Pages.css';

export default function SchedulerView() {
  const TIMES = ['10:00', '10:05', '10:10', '10:15', '10:20', '10:25', '10:30'];
  
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="text-gradient">Scheduler View</h1>
      </div>

      <GlassCard title="Upcoming Retries (Next 30 mins)">
        <div className="timeline-container mt-6" style={{ overflowX: 'auto', paddingBottom: '2rem' }}>
            <div style={{ display: 'flex', minWidth: '800px', position: 'relative' }}>
                {TIMES.map((time, idx) => (
                    <div key={time} style={{ flex: 1, position: 'relative' }}>
                        <div className="text-xs text-muted mb-2">{time}</div>
                        <div style={{ height: '200px', borderLeft: '1px dashed var(--border-light)', position: 'relative' }}>
                            {/* Mock events */}
                            {idx === 1 && (
                                <div className="schedule-block payment">
                                    <div className="font-bold">24 Payment Retries</div>
                                </div>
                            )}
                            {idx === 2 && (
                                <div className="schedule-block email" style={{ top: '60px' }}>
                                    <div className="font-bold">12 Email Retries</div>
                                </div>
                            )}
                            {idx === 4 && (
                                <div className="schedule-block sync" style={{ top: '20px' }}>
                                    <div className="font-bold">150 DB Sync Jobs</div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </GlassCard>

      <style jsx>{`
        .schedule-block {
            position: absolute;
            width: 120px;
            padding: 0.75rem;
            border-radius: var(--radius-md);
            font-size: 0.75rem;
            left: 20px;
            border: 1px solid var(--border-light);
            background: var(--bg-card);
        }
        .schedule-block.payment {
            border-left: 3px solid var(--accent-blue);
            color: var(--text-primary);
            top: 10px;
        }
        .schedule-block.email {
            border-left: 3px solid var(--status-green);
            color: var(--text-primary);
        }
        .schedule-block.sync {
            border-left: 3px solid var(--status-yellow);
            color: var(--text-primary);
        }
      `}</style>
    </div>
  );
}
