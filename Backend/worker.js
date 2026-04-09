const Job = require('./jobModel');

function getBackoffDelay(baseDelay, retryCount) {
  let delay = baseDelay * Math.pow(2, retryCount);

  const jitter = delay * 0.5 * (Math.random() * 2 - 1);
  delay = Math.max(0.1, delay + jitter);

  return delay * 1000;
}

async function worker() {
  const jobs = await Job.find({
    status: "Retrying",
    nextRetryAt: { $lte: new Date() }
  });

  for (let job of jobs) {

    if (job.retryCount >= job.maxRetries) {
      job.status = "Failed";
      job.nextRetryAt = null;
      await job.save();
      continue;
    }

    try {
      const success = Math.random() > 0.5;

      if (success) {
        job.status = "Success";
        job.nextRetryAt = null;

        job.timeline.push({
          attempt: job.retryCount,
          status: "Success",
          time: new Date()
        });

      } else {
        throw new Error("Gateway Timeout (504)");
      }

    } catch (err) {
      job.retryCount += 1;

      job.errorLog.push({
        message: err.message,
        timestamp: new Date()
      });

      job.timeline.push({
        attempt: job.retryCount,
        status: "Failed",
        time: new Date()
      });

      if (job.retryCount >= job.maxRetries) {
        job.status = "Failed";
        job.nextRetryAt = null;
      } else {
        const delay = getBackoffDelay(job.baseDelay, job.retryCount);
        job.nextRetryAt = new Date(Date.now() + delay);
      }
    }

    await job.save();
  }
}
