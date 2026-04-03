import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import JobsTable from './pages/JobsTable';
import JobDetails from './pages/JobDetails';
import BackoffVisualizer from './pages/BackoffVisualizer';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/jobs" replace />} />
          <Route path="jobs" element={<JobsTable />} />
          <Route path="jobs/:id" element={<JobDetails />} />
          <Route path="backoff" element={<BackoffVisualizer />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
