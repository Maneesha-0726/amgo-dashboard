import type { Campaign } from "../../../shared/types/campaign.ts";

export const mockCampaigns: Campaign[] = [
  {
    id: "1",
    name: "Summer Sale",
    status: "active",
    budget: 5000,
    impressions: 120000,
    clicks: 4300,
    createdAt: "2025-02-01",
  },
  {
    id: "2",
    name: "Winter Offers",
    status: "paused",
    budget: 3000,
    impressions: 85000,
    clicks: 2100,
    createdAt: "2025-01-18",
  },
  {
    id: "3",
    name: "New Product Launch",
    status: "draft",
    budget: 8000,
    impressions: 0,
    clicks: 0,
    createdAt: "2025-02-10",
  },
  {
    id: "4",
    name: "Brand Awareness",
    status: "completed",
    budget: 10000,
    impressions: 300000,
    clicks: 9800,
    createdAt: "2024-12-15",
  },
];