import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Campaign, CampaignStatus } from "../../shared/types/campaign";
import { getCampaigns } from "./campaignService";

export default function EditCampaign() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);

  // Load campaign
  useEffect(() => {
    getCampaigns().then((data) => {
      const found = data.find((c) => c.id === id);
      setCampaign(found || null);
      setLoading(false);
    });
  }, [id]);

  const handleChange = (
    field: keyof Campaign,
    value: string | number
  ) => {
    if (!campaign) return;
    setCampaign({ ...campaign, [field]: value });
  };

  const handleSave = () => {
  if (!campaign) return;

  const existing =
    JSON.parse(localStorage.getItem("campaigns") || "[]");

  const updated = existing.map((c: Campaign) =>
    c.id === campaign.id ? campaign : c
  );

  localStorage.setItem("campaigns", JSON.stringify(updated));

  alert("Campaign updated successfully!");
  navigate("/campaigns");
};

  if (loading) return <p>Loading...</p>;

  if (!campaign) return <p>Campaign not found</p>;

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-6">
        Edit Campaign
      </h1>

      <div className="space-y-4">

        {/* Name */}
        <div>
          <label className="block mb-1">Name</label>
          <input
            className="border p-2 w-full rounded"
            value={campaign.name}
            onChange={(e) =>
              handleChange("name", e.target.value)
            }
          />
        </div>

        {/* Budget */}
        <div>
          <label className="block mb-1">Budget</label>
          <input
            type="number"
            className="border p-2 w-full rounded"
            value={campaign.budget}
            onChange={(e) =>
              handleChange("budget", Number(e.target.value))
            }
          />
        </div>

        {/* Status */}
        <div>
          <label className="block mb-1">Status</label>
          <select
            className="border p-2 w-full rounded"
            value={campaign.status}
            onChange={(e) =>
              handleChange(
                "status",
                e.target.value as CampaignStatus
              )
            }
          >
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="draft">Draft</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleSave}
          >
            Save
          </button>

          <button
            className="bg-gray-300 px-4 py-2 rounded"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}