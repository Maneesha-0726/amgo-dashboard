export type JobStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed";

export async function startJob(): Promise<JobStatus> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const success = Math.random() > 0.3;
      resolve(success ? "completed" : "failed");
    }, 3000);
  });
}