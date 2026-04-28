const Job = require('./jobModel');         // Main jobs collection
const FailedJob = require('./failedModel'); // Collection for permanently failed jobs

// Function to calculate exponential backoff delay with jitter
function getBackoffDelay(baseDelay, retryCount) {

  // Exponential backoff: baseDelay * 2^retryCount
  let delay = baseDelay * Math.pow(2, retryCount);

  // Add jitter (+/- 50%) to avoid retry spikes (thundering herd problem)
  const jitter = delay * 0.5 * (Math.random() * 2 - 1);

  // Ensure delay doesn't go below a minimum threshold
  delay = Math.max(0.1, delay + jitter);

  // Convert delay to milliseconds
  return delay * 1000;
}

// Move job to FailedJob collection after max retries exceeded
async function moveToFailed(job) {

  // Create a record in FailedJob collection
  await FailedJob.create({
    jobId: job.jobId,
    service: job.service,
    payload: job.payload,
    retryCount: job.retryCount,
    maxRetries: job.maxRetries,
    baseDelay: job.baseDelay,
    errorLog: job.errorLog,
    timeline: job.timeline
  });

  // Remove job from active Job collection
  await Job.deleteOne({ _id: job._id });

  console.log(`Job ${job.jobId} moved to FailedJobs`);
}

// Worker function to process retryable jobs
async function worker() {

  // Fetch jobs that are ready for retry
  const jobs = await Job.find({
    status: "Retrying",
    nextRetryAt: { $lte: new Date() } // Only jobs whose retry time has arrived
  });

  // Loop through each job
  for (let job of jobs) {

    try {
      // Simulate job execution (50% chance of success)
      const success = Math.random() > 0.5;

      if (success) {
        // Mark job as successful
        job.status = "Success";
        job.nextRetryAt = null;

        // Add success entry to timeline
        job.timeline.push({
          attempt: job.retryCount,
          status: "Success",
          time: new Date()
        });

        await job.save();
        continue; // Move to next job
      }

      // Simulate failure
      throw new Error("Gateway Timeout (504)");

    } catch (err) {

      // Increment retry count
      job.retryCount += 1;

      // Log error details
      job.errorLog.push({
        message: err.message,
        timestamp: new Date()
      });

      // Add failure entry to timeline
      job.timeline.push({
        attempt: job.retryCount,
        status: "Failed",
        time: new Date()
      });

      // Check if max retries exceeded
      if (job.retryCount >= job.maxRetries) {
        await moveToFailed(job); // Move job to failed collection
        continue;
      }

      // Calculate next retry delay
      const delay = getBackoffDelay(job.baseDelay, job.retryCount);

      // Schedule next retry time
      job.nextRetryAt = new Date(Date.now() + delay);

      // Save updated job state
      await job.save();
    }
  }
}

// Export worker function to be used in scheduler/cron
module.exports = worker;