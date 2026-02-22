import { mockCampaigns } from "./mockCampaigns";
import type { Campaign } from "../../shared/types/campaign";

const STORAGE_KEY = "campaigns";

// 🔥 Simulate API delay
const delay = (ms: number = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// 🔥 Optional: simulate random failure (10%)
const simulateFailure = () => {
  if (Math.random() < 0.1) {
    throw new Error("Simulated API failure");
  }
};

// GET ALL
export async function getCampaigns(): Promise<Campaign[]> {
  await delay();

  const stored = localStorage.getItem(STORAGE_KEY);

  if (stored) {
    return JSON.parse(stored);
  } else {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(mockCampaigns)
    );
    return mockCampaigns;
  }
}

// GET BY ID
export async function getCampaignById(
  id: string
): Promise<Campaign | undefined> {
  await delay();

  const campaigns =
    JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

  return campaigns.find((c: Campaign) => c.id === id);
}

// ADD
export async function addCampaign(
  campaign: Campaign
): Promise<void> {
  await delay();
  simulateFailure();

  const campaigns = await getCampaigns();
  const updated = [campaign, ...campaigns];

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updated)
  );
}

// UPDATE
export async function updateCampaign(
  updatedCampaign: Campaign
): Promise<void> {
  await delay();
  simulateFailure();

  const campaigns = await getCampaigns();

  const updated = campaigns.map((c) =>
    c.id === updatedCampaign.id ? updatedCampaign : c
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updated)
  );
}

// DELETE
export async function deleteCampaign(
  id: string
): Promise<void> {
  await delay();
  simulateFailure();

  const campaigns = await getCampaigns();

  const updated = campaigns.filter((c) => c.id !== id);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updated)
  );
}

// BULK DELETE
export async function bulkDeleteCampaigns(
  ids: string[]
): Promise<void> {
  await delay();
  simulateFailure();

  const campaigns = await getCampaigns();

  const updated = campaigns.filter(
    (c) => !ids.includes(c.id)
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updated)
  );
}