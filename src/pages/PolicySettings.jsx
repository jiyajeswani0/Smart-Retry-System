import GlassCard from '../components/ui/GlassCard';
import { Save, History } from 'lucide-react';
import './Pages.css';

export default function PolicySettings() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="text-gradient">Policy Settings</h1>
      </div>

      <div className="dashboard-grid">
        <GlassCard title="Global Retry Policy Configuration" className="mb-6">
          <div className="form-group">
            <label>Default Retry Limit</label>
            <input type="number" defaultValue={5} />
            <span className="text-sub text-xs">Maximum number of retries before a job is moved to the Dead Letter Queue.</span>
          </div>
          
          <div className="form-group mt-4">
            <label>Delay Type</label>
            <select defaultValue="exponential">
              <option value="fixed">Fixed Delay</option>
              <option value="exponential">Exponential Backoff</option>
              <option value="linear">Linear Backoff</option>
            </select>
          </div>

          <div className="form-group mt-4">
            <label>Base Delay (Seconds)</label>
            <input type="number" defaultValue={2} />
          </div>

          <div className="flex items-center justify-between mt-6 p-4 mb-6" style={{background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)'}}>
            <div>
              <div className="font-bold">Add Jitter</div>
              <div className="text-sub text-xs">Randomize delay to prevent synchronized spikes</div>
            </div>
            <label className="toggle-switch">
              <input type="checkbox" defaultChecked />
              <span className="slider round"></span>
            </label>
          </div>

          <button className="btn-primary flex items-center gap-2 mt-4 ml-auto">
            <Save size={18} /> Save Settings
          </button>
        </GlassCard>

        <div className="side-panel">
          <GlassCard title="Version History" className="mb-6">
            <div className="timeline">
              <div className="flex gap-4 mb-4 items-start">
                <div style={{ color: 'var(--accent-blue)', marginTop: '2px' }}><History size={16} /></div>
                <div>
                  <div className="text-sm">v1.4 (Current)</div>
                  <div className="text-sub text-xs">Changed Delay Type to Exponential</div>
                  <div className="text-xs text-muted mt-1">2 days ago by Admin</div>
                </div>
              </div>
              <div className="flex gap-4 mb-4 items-start">
                <div style={{ color: 'var(--text-muted)', marginTop: '2px' }}><History size={16} /></div>
                <div>
                  <div className="text-sm">v1.3</div>
                  <div className="text-sub text-xs">Increased Default Retry Limit to 5</div>
                  <div className="text-xs text-muted mt-1">1 week ago by Admin</div>
                </div>
              </div>
              <div className="flex gap-4 mb-4 items-start">
                <div style={{ color: 'var(--text-muted)', marginTop: '2px' }}><History size={16} /></div>
                <div>
                  <div className="text-sm">v1.2</div>
                  <div className="text-sub text-xs">Enabled Jitter</div>
                  <div className="text-xs text-muted mt-1">3 weeks ago by Admin</div>
                </div>
              </div>
            </div>
            <button className="btn-secondary w-full mt-4">View All Changes</button>
          </GlassCard>
        </div>
      </div>
      
      <style jsx>{`
      .toggle-switch {
        position: relative;
        display: inline-block;
        width: 50px;
        height: 24px;
      }
      .toggle-switch input { opacity: 0; width: 0; height: 0; }
      .slider {
        position: absolute;
        cursor: pointer;
        top: 0; left: 0; right: 0; bottom: 0;
        background-color: var(--border-light);
        transition: .4s;
      }
      .slider:before {
        position: absolute;
        content: "";
        height: 16px; width: 16px;
        left: 4px; bottom: 4px;
        background-color: white;
        transition: .4s;
      }
      input:checked + .slider { background-color: var(--accent-blue); }
      input:checked + .slider:before { transform: translateX(26px); }
      .slider.round { border-radius: 24px; }
      .slider.round:before { border-radius: 50%; }
      `}</style>
    </div>
  );
}
