const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  jobId: String,
  service: String,
  status: String,
  retryCount: { type: Number, default: 0 },
  maxRetries: { type: Number, default: 5 },
  baseDelay: { type: Number, default: 1 },
  nextRetryAt: Date,
  payload: Object,

  errorLog: [
    {
      message: String,
      timestamp: Date,
    }
  ],

  timeline: [
    {
      attempt: Number,
      status: String,
      time: Date,
    }
  ]
});

// ✅ IMPORTANT
module.exports = mongoose.model('Job', jobSchema);