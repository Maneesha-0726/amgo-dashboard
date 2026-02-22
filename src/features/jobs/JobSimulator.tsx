import { useState } from "react";
import { startJob } from "./jobService";
import type { JobStatus } from "./jobService";
export default function JobSimulator() {
  const [status, setStatus] = useState<JobStatus>("pending");

  const runJob = async () => {
    setStatus("processing");
    const result = await startJob();
    setStatus(result);
  };

  return (
    <div className="mt-10 border rounded-xl p-6 shadow-sm bg-gray-50 w-72">

      <h2 className="text-lg font-semibold mb-2">
        Background Job
      </h2>

      <p className="mb-3 font-medium">
        Status:
        <span
          className={`ml-2 px-2 py-1 rounded text-white text-sm
            ${status === "pending" && "bg-gray-500"}
            ${status === "processing" && "bg-blue-500"}
            ${status === "completed" && "bg-green-600"}
            ${status === "failed" && "bg-red-600"}
          `}
        >
          {status}
        </span>
      </p>

      {status === "pending" && (
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={runJob}
        >
          Start Job
        </button>
      )}

      {status === "processing" && (
        <p className="text-blue-600">Processing...</p>
      )}

      {status === "completed" && (
        <p className="text-green-600">
          Job Completed Successfully!
        </p>
      )}

      {status === "failed" && (
        <p className="text-red-600">
          Job Failed. Try Again.
        </p>
      )}

    </div>
  );
}