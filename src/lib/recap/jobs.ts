import type { RecapJob } from "./types";

const jobs = new Map<string, RecapJob>();

export function createJob(
  partial: Omit<RecapJob, "createdAt" | "updatedAt">,
): RecapJob {
  const now = new Date().toISOString();
  const job: RecapJob = {
    ...partial,
    createdAt: now,
    updatedAt: now,
  };
  jobs.set(job.id, job);
  return job;
}

export function updateJob(
  id: string,
  patch: Partial<RecapJob>,
): RecapJob | null {
  const job = jobs.get(id);
  if (!job) return null;
  const updated: RecapJob = {
    ...job,
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  jobs.set(id, updated);
  return updated;
}

export function getJob(id: string): RecapJob | null {
  return jobs.get(id) ?? null;
}

export function listJobsForWorld(worldId: string): RecapJob[] {
  return Array.from(jobs.values())
    .filter((j) => j.worldId === worldId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
}
