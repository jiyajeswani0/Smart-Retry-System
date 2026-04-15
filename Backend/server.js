const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Job = require('./jobModel');
const FailedJob = require('./failedModel');
const worker = require('./worker');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/retrySystem");

// HELPER

function formatNextRetry(date) {
  if (!date) return "N/A";
  const diff = Math.floor((date - Date.now()) / 1000);
  if (diff <= 0) return "now";
  if (diff < 60) return `in ${diff}s`;
  return `in ${Math.floor(diff / 60)} mins`;
}

//CREATE JOB

app.post("/jobs", async (req, res) => {
  const { service, payload, maxRetries, baseDelay } = req.body;

  const job = new Job({
    jobId: "job-" + Math.random().toString(36).substring(2, 8),
    service,
    status: "Retrying",
    retryCount: 0,
    maxRetries: maxRetries || 5,
    baseDelay: baseDelay || 1,
    nextRetryAt: new Date(),
    payload: payload || {},
    errorLog: [],
    timeline: [
      {
        attempt: 0,
        status: "Triggered",
        time: new Date()
      }
    ]
  });

  await job.save();
  res.json(job);
});

//GET ALL JOBS

app.get("/jobs", async (req, res) => {
  const jobs = await Job.find();

  const formatted = jobs.map(j => ({
    id: j.jobId,
    service: j.service,
    status: j.status,
    count: j.retryCount,
    nextRetry: formatNextRetry(j.nextRetryAt),
  }));

  res.json(formatted);
});

// GET FAILED JOBS

app.get("/jobs/failed", async (req, res) => {
  const jobs = await FailedJob.find();

  const formatted = jobs.map(j => ({
    id: j.jobId,
    service: j.service,
    status: "Failed",
    count: j.retryCount,
    nextRetry: "N/A"
  }));

  res.json(formatted);
});

//GET SINGLE JOB

app.get("/jobs/:id", async (req, res) => {
  const job = await Job.findOne({ jobId: req.params.id });

  if (!job) return res.status(404).json({ error: "Not found" });

  res.json(job);
});

//RETRY ACTIVE JOB 

app.post("/jobs/:id/retry", async (req, res) => {
  const job = await Job.findOne({ jobId: req.params.id });

  if (!job) return res.status(404).json({ error: "Not found" });

  job.nextRetryAt = new Date();
  job.status = "Retrying";

  await job.save();

  res.json({ message: "Retry triggered" });
});

//DELETE JOB

app.delete("/jobs/:id", async (req, res) => {
  await Job.deleteOne({ jobId: req.params.id });
  res.json({ message: "Job deleted" });
});

//RETRY FAILED (ALL / SELECTED)

app.post("/jobs/failed/retry-all", async (req, res) => {
  try {
    const { jobIds } = req.body;

    let failedJobs;

    if (jobIds && jobIds.length > 0) {
      // 🔹 Retry selected jobs
      failedJobs = await FailedJob.find({ jobId: { $in: jobIds } });
    } else {
      // 🔹 Retry all jobs
      failedJobs = await FailedJob.find();
    }

    const newJobs = [];

    for (let job of failedJobs) {
      const newJob = await Job.create({
        jobId: "job-" + Math.random().toString(36).substring(2, 8),
        service: job.service,
        status: "Retrying",
        retryCount: 0,
        maxRetries: job.maxRetries,
        baseDelay: job.baseDelay,
        nextRetryAt: new Date(),
        payload: job.payload,
        errorLog: [],
        timeline: [
          {
            attempt: 0,
            status: "Re-triggered",
            time: new Date()
          }
        ]
      });

      newJobs.push(newJob);
    }

    // Delete only processed jobs
    if (jobIds && jobIds.length > 0) {
      await FailedJob.deleteMany({ jobId: { $in: jobIds } });
    } else {
      await FailedJob.deleteMany();
    }

    res.json({
      message: "Jobs re-added",
      count: newJobs.length
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//BACKOFF VISUALIZER

app.post("/backoff", (req, res) => {
  const { baseDelay, maxRetries, jitter } = req.body;

  let data = [];
  let accTime = 0;

  for (let i = 1; i <= maxRetries; i++) {
    let delay = baseDelay * Math.pow(2, i - 1);

    if (jitter) {
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

  res.json(data);
});


setInterval(worker, 3000);


app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});