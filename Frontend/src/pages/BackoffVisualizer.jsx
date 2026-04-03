import { useState, useMemo } from 'react';
import GlassCard from '../components/ui/GlassCard';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import './Pages.css';

export default function BackoffVisualizer() {
  const [baseDelay, setBaseDelay] = useState(1);
  const [maxRetries, setMaxRetries] = useState(8);
  const [jitter, setJitter] = useState(false);

  const chartData = useMemo(() => {
    let data = [];
    let accTime = 0;
    for (let i = 1; i <= maxRetries; i++) {
        // Exponential backoff: baseDelay * 2^(i-1)
        let delay = baseDelay * Math.pow(2, i - 1);
        if (jitter) {
            // simple random jitter within 50%
            const jitterAmount = delay * 0.5 * (Math.random() * 2 - 1);
            delay = Math.max(0.1, delay + jitterAmount);
        }
        accTime += delay;
        data.push({
            attempt: `Req ${i}`,
            delay: Number(delay.toFixed(2)),
            totalTime: Number(accTime.toFixed(2))
        });
    }
    return data;
  }, [baseDelay, maxRetries, jitter]);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="text-gradient">Backoff Algorithm Visualizer</h1>
      </div>

      <div className="dashboard-grid">
        <div className="main-charts">
          <GlassCard title="Exponential Backoff Curve">
            <div className="chart-container" style={{ height: '400px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="attempt" stroke="#A396C1" tick={{fill: '#A396C1', fontSize: 12}} />
                  <YAxis yAxisId="left" stroke="#3b82f6" tick={{fill: '#3b82f6', fontSize: 12}} />
                  <YAxis yAxisId="right" orientation="right" stroke="#14b8a6" tick={{fill: '#14b8a6', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '6px' }}
                    itemStyle={{ color: '#f8fafc' }}
                  />
                  <Line yAxisId="left" type="monotone" dataKey="delay" name="Delay (s)" stroke="#3b82f6" strokeWidth={3} dot={{r: 4, fill: '#3b82f6'}} activeDot={{r: 6}} />
                  <Line yAxisId="right" type="monotone" dataKey="totalTime" name="Cumulative Time (s)" stroke="#14b8a6" strokeWidth={3} strokeDasharray="5 5" dot={{r: 4, fill: '#14b8a6'}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center mt-4 gap-8 text-sub">
                <div className="flex items-center gap-2">
                    <div style={{width: 12, height: 12, borderRadius: 6, background: '#3b82f6'}}></div>
                    Current Delay (Seconds)
                </div>
                <div className="flex items-center gap-2">
                    <div style={{width: 12, height: 12, borderRadius: 6, background: '#14b8a6'}}></div>
                    Cumulative Time (Seconds)
                </div>
            </div>
          </GlassCard>
        </div>

        <div className="side-panel">
          <GlassCard title="Controls">
            <div className="form-group">
                <label>Base Delay (Seconds): {baseDelay}s</label>
                <input 
                    type="range" 
                    min="0.1" max="10" step="0.1" 
                    value={baseDelay} 
                    onChange={(e) => setBaseDelay(parseFloat(e.target.value))}
                />
            </div>
            <div className="form-group">
                <label>Max Retries: {maxRetries}</label>
                <input 
                    type="range" 
                    min="1" max="15" step="1" 
                    value={maxRetries} 
                    onChange={(e) => setMaxRetries(parseInt(e.target.value))}
                />
            </div>

            <div className="flex items-center justify-between mt-6 p-4" style={{background: 'rgba(0,0,0,0.2)', borderRadius: '8px'}}>
                <div>
                    <div className="font-bold">Add Jitter</div>
                    <div className="text-sub text-xs">Prevents thundering herd</div>
                </div>
                <label className="toggle-switch">
                    <input type="checkbox" checked={jitter} onChange={(e) => setJitter(e.target.checked)} />
                    <span className="slider round"></span>
                </label>
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
            input:checked + .slider { background-color: var(--accent-pink); }
            input:checked + .slider:before { transform: translateX(26px); }
            .slider.round { border-radius: 24px; }
            .slider.round:before { border-radius: 50%; }
            `}</style>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
