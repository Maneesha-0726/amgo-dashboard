export type CampaignStatus =
  | "active"
  | "paused"
  | "draft"
  | "completed";

export type Campaign = {
  id: string;
  name: string;
  status: CampaignStatus;
  budget: number;
  impressions: number;
  clicks: number;
  createdAt: string;   // ✅ ADD THIS
};