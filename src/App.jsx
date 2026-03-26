import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import JobsTable from './pages/JobsTable';
import JobDetails from './pages/JobDetails';
import BackoffVisualizer from './pages/BackoffVisualizer';
import QueueView from './pages/QueueView';
import PolicySettings from './pages/PolicySettings';
import SchedulerView from './pages/SchedulerView';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="jobs" element={<JobsTable />} />
          <Route path="jobs/:id" element={<JobDetails />} />
          <Route path="backoff" element={<BackoffVisualizer />} />
          <Route path="queue" element={<QueueView />} />
          <Route path="policy" element={<PolicySettings />} />
          <Route path="scheduler" element={<SchedulerView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
