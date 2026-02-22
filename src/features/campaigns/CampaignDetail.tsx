import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Campaign } from "../../shared/types/campaign";
import JobSimulator from "../jobs/JobSimulator";
import PerformanceChart from "../../shared/components/PerformanceChart";
import { mockCampaigns } from "./mockCampaigns";

type Tab = "overview" | "assets" | "performance";

export default function CampaignDetail() {
  const { id } = useParams();

  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [formData, setFormData] = useState<Campaign | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showToast, setShowToast] = useState(false);

  // ✅ LOAD FROM localStorage FIRST, ELSE fallback to mockCampaigns
  useEffect(() => {
    const storedCampaigns: Campaign[] =
      JSON.parse(localStorage.getItem("campaigns") || "[]");

    const source =
      storedCampaigns.length > 0
        ? storedCampaigns
        : mockCampaigns;

    const found = source.find((c) => c.id === id);

    if (found) {
      setCampaign(found);
      setFormData(found);
    }
  }, [id]);

  if (!campaign || !formData) {
    return <p>Campaign not found</p>;
  }

  const handleChange = (
    field: keyof Campaign,
    value: string | number
  ) => {
    setFormData({ ...formData, [field]: value });
    setIsDirty(true);
  };

  const handleSave = () => {
    const stored: Campaign[] =
      JSON.parse(localStorage.getItem("campaigns") || "[]");

    const updated = stored.map((c) =>
      c.id === campaign.id ? formData : c
    );

    localStorage.setItem("campaigns", JSON.stringify(updated));

    setCampaign(formData);
    setIsDirty(false);
    setShowToast(true);

    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow">

      {/* Toast */}
      {showToast && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow">
          Changes saved successfully
        </div>
      )}

      <h1 className="text-3xl font-semibold mb-2">
        Campaign Detail
      </h1>

      <p className="text-gray-500 mb-6">
        Manage campaign details and performance
      </p>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
        {["overview", "assets", "performance"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as Tab)}
            className={`px-4 py-2 rounded-lg capitalize transition
              ${
                activeTab === tab
                  ? "bg-white shadow text-blue-600"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-2 gap-6 max-w-xl">

          {isDirty && (
            <p className="col-span-2 text-yellow-600 font-medium">
              You have unsaved changes
            </p>
          )}

          <div>
            <label className="block font-medium">Name</label>
            <input
              className="border rounded-lg p-2 w-full"
              value={formData.name}
              onChange={(e) =>
                handleChange("name", e.target.value)
              }
            />
          </div>

          <div>
            <label className="block font-medium">Budget</label>
            <input
              type="number"
              className="border rounded-lg p-2 w-full"
              value={formData.budget}
              onChange={(e) =>
                handleChange("budget", Number(e.target.value))
              }
            />
          </div>

          <div className="col-span-2">
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* ASSETS */}
      {activeTab === "assets" && (
        <div className="bg-gray-50 p-6 rounded-lg border w-fit space-y-4">

          <input type="file" className="border p-2 rounded" />

          <div className="w-72 h-3 bg-gray-200 rounded">
            <div
              className="h-full bg-green-500 rounded"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>

          <p>{uploadProgress}%</p>

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => {
              let p = 0;
              const interval = setInterval(() => {
                p += 10;
                setUploadProgress(p);
                if (p >= 100) clearInterval(interval);
              }, 300);
            }}
          >
            Simulate Upload
          </button>

        </div>
      )}

      {/* PERFORMANCE */}
      {activeTab === "performance" && (
        <div className="mt-6 space-y-6">

          <h2 className="text-xl font-semibold">
            Campaign Performance
          </h2>

          <PerformanceChart
            impressions={campaign.impressions}
            clicks={campaign.clicks}
          />

          <div className="grid grid-cols-3 gap-4 max-w-xl">

            <div className="bg-white p-4 rounded-lg shadow border">
              <p className="text-gray-500">Impressions</p>
              <p className="text-2xl font-bold">
                {campaign.impressions}
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border">
              <p className="text-gray-500">Clicks</p>
              <p className="text-2xl font-bold">
                {campaign.clicks}
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border">
              <p className="text-gray-500">CTR</p>
              <p className="text-2xl font-bold">
                {campaign.impressions === 0
                  ? "0%"
                  : ((campaign.clicks / campaign.impressions) * 100).toFixed(2) + "%"}
              </p>
            </div>

          </div>
        </div>
      )}

      <JobSimulator />

    </div>
  );
}