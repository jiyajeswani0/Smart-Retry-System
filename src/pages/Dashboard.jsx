import GlassCard from '../components/ui/GlassCard';
import Badge from '../components/ui/Badge';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, XCircle, CheckCircle, RefreshCw } from 'lucide-react';
import './Pages.css';

const retryData = [
  { time: '10:00', attempts: 40 },
  { time: '10:05', attempts: 30 },
  { time: '10:10', attempts: 55 },
  { time: '10:15', attempts: 25 },
  { time: '10:20', attempts: 60 },
  { time: '10:25', attempts: 35 },
];

export default function Dashboard() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="text-gradient">Retry System Overview</h1>
        <Badge status="success" text="System Healthy" className="mr-auto" />
      </div>

      <div className="stats-grid mb-6">
        <GlassCard className="stat-card">
          <div className="stat-icon-wrapper blue">
            <RefreshCw size={24} />
          </div>
          <div className="stat-content">
            <p className="text-sub">Total Jobs</p>
            <h3>1,245</h3>
          </div>
        </GlassCard>
        
        <GlassCard className="stat-card">
          <div className="stat-icon-wrapper yellow">
            <Activity size={24} />
          </div>
          <div className="stat-content">
            <p className="text-sub">Active Retries</p>
            <h3>42</h3>
          </div>
        </GlassCard>

        <GlassCard className="stat-card">
          <div className="stat-icon-wrapper red">
            <XCircle size={24} />
          </div>
          <div className="stat-content">
            <p className="text-sub">Failed Jobs</p>
            <h3>18</h3>
          </div>
        </GlassCard>

        <GlassCard className="stat-card">
          <div className="stat-icon-wrapper green">
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <p className="text-sub">Success Rate</p>
            <h3>98.2%</h3>
          </div>
        </GlassCard>
      </div>

      <div className="dashboard-grid">
        <div className="main-charts">
          <GlassCard title="Retry Activity over Time" className="mb-6">
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={retryData}>
                  <XAxis dataKey="time" stroke="#A396C1" tick={{fill: '#A396C1', fontSize: 12}} />
                  <YAxis stroke="#A396C1" tick={{fill: '#A396C1', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '6px' }}
                    itemStyle={{ color: '#f8fafc' }}
                  />
                  <Line type="monotone" dataKey="attempts" stroke="#3b82f6" strokeWidth={3} dot={{r: 4, fill: '#3b82f6'}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>


        </div>

        <div className="side-panel">
          <GlassCard title="Queue Health Indicators" className="mb-6">
            <div className="queue-health-item">
              <div className="flex justify-between mb-2">
                <span>Payment Queue</span>
                <span className="text-sub">Healthy</span>
              </div>
              <div className="progress-bg">
                <div className="progress-bar" style={{width: '90%', background: 'var(--status-green)'}}></div>
              </div>
            </div>
            
            <div className="queue-health-item">
              <div className="flex justify-between mb-2">
                <span>Email Queue</span>
                <span className="text-sub" style={{color: 'var(--status-yellow)'}}>Warning</span>
              </div>
              <div className="progress-bg">
                <div className="progress-bar" style={{width: '60%', background: 'var(--status-yellow)'}}></div>
              </div>
            </div>
            
            <div className="queue-health-item">
              <div className="flex justify-between mb-2">
                <span>Webhook Queue</span>
                <span className="text-sub">Healthy</span>
              </div>
              <div className="progress-bg">
                <div className="progress-bar" style={{width: '85%', background: 'var(--status-green)'}}></div>
              </div>
            </div>
          </GlassCard>
          
          <GlassCard title="System Load">
            <div className="circular-meter">
               <div className="load-label">
                 <h2>42%</h2>
                 <p className="text-sub">CPU Usage</p>
               </div>
               {/* A simple CSS circle to represent load */}
               <svg viewBox="0 0 100 100" className="load-svg">
                 <circle cx="50" cy="50" r="40" className="load-bg" />
                 <circle cx="50" cy="50" r="40" className="load-value" strokeDasharray="251" strokeDashoffset="145" />
               </svg>
            </div>
            
            <div className="memory-load mt-4">
              <div className="flex justify-between mb-2">
                <span className="text-sub">Memory</span>
                <span className="text-sub">28GB / 64GB</span>
              </div>
              <div className="progress-bg">
                <div className="progress-bar" style={{width: '43%', background: 'var(--accent-purple)'}}></div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
