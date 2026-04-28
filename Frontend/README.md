# ⚛️ Smart Retry Coordinator – Frontend

A modern React dashboard for monitoring and managing the **Smart Retry Coordinator** system.

## 📌 Overview

The frontend allows users to:
- Monitor jobs in real-time.
- View detailed job execution timelines and error logs.
- Visualize exponential backoff strategies with an interactive simulator.
- Manually manage failed jobs.

## ⚙️ Tech Stack

- **Framework**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Charts**: Recharts
- **Styling**: CSS

## 📁 Project Structure

```text
Frontend/
├── src/
│   ├── components/  # Reusable UI components
│   ├── pages/       # Page-level components (JobsTable, JobDetails, etc.)
│   ├── App.jsx      # Main routing configuration
│   └── main.jsx     # Entry point
├── public/          # Static assets
└── vite.config.js   # Vite configuration
```

## 🚀 Getting Started

### 1️⃣ Install dependencies
```bash
npm install
```

### 2️⃣ Run development server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### 3️⃣ Build for production
```bash
npm run build
```
