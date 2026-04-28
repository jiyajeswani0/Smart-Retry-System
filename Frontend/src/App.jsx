import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// BrowserRouter: enables routing using browser history
// Routes: container for all routes
// Route: defines a single route
// Navigate: used for redirection

import MainLayout from './components/layout/MainLayout'; // Layout wrapper (navbar, sidebar, etc.)
import JobsTable from './pages/JobsTable';               // Page showing all jobs
import JobDetails from './pages/JobDetails';             // Page for single job details
import BackoffVisualizer from './pages/BackoffVisualizer'; // Page to visualize retry/backoff logic

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Parent route using MainLayout */}
        <Route path="/" element={<MainLayout />}>

          {/* Default route: redirect "/" → "/jobs" */}
          <Route index element={<Navigate to="/jobs" replace />} />

          {/* Route to display all jobs */}
          <Route path="jobs" element={<JobsTable />} />

          {/* Dynamic route for a specific job (e.g., /jobs/123) */}
          <Route path="jobs/:id" element={<JobDetails />} />

          {/* Route for backoff visualization page */}
          <Route path="backoff" element={<BackoffVisualizer />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;