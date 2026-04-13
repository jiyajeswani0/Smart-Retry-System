const mongoose = require("mongoose");

const failedJobSchema = new mongoose.Schema({
  jobId: String,
  service: String,
  payload: Object,
  retryCount: Number,
  maxRetries: Number,
  baseDelay: Number,
  errorLog: [],
  timeline: [],
  failedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("FailedJob", failedJobSchema);