const mongoose = require('mongoose');

// Define schema for Job collection
const jobSchema = new mongoose.Schema({

  // Unique identifier for the job
  jobId: String,

  // Name of the service handling the job (e.g., email, payment, etc.)
  service: String,

  // Current status of the job (e.g., pending, success, failed)
  status: String,

  // Number of retry attempts made so far (default = 0)
  retryCount: { type: Number, default: 0 },

  // Maximum number of retries allowed (default = 5)
  maxRetries: { type: Number, default: 5 },

  // Base delay (in seconds or ms depending on usage) for retry logic
  baseDelay: { type: Number, default: 1 },

  // Timestamp for when the next retry should occur
  nextRetryAt: Date,

  // Stores the actual job data (request body, metadata, etc.)
  payload: Object,

  // Array to store error logs for each failed attempt
  errorLog: [
    {
      // Error message
      message: String,

      // Time when the error occurred
      timestamp: Date,
    }
  ],

  // Tracks the timeline of job attempts
  timeline: [
    {
      // Attempt number (1st try, 2nd retry, etc.)
      attempt: Number,

      // Status at that attempt (success, failed, retrying)
      status: String,

      // Time of that attempt
      time: Date,
    }
  ]
});

// Export the model to interact with the "Job" collection in MongoDB
module.exports = mongoose.model('Job', jobSchema);