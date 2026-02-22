import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Campaign } from "../../shared/types/campaign";

export default function AddCampaign() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    budget: 0,
    status: "draft",
  });

  const handleSave = () => {
    const existing =
      JSON.parse(localStorage.getItem("campaigns") || "[]");

    const newCampaign: Campaign = {
  id: Date.now().toString(),
  name: form.name,
  budget: Number(form.budget),
  status: form.status as any,
  impressions: Math.floor(Math.random() * 50000) + 5000,
  clicks: Math.floor(Math.random() * 5000) + 500,
  createdAt: new Date().toISOString(),  
};

    localStorage.setItem(
      "campaigns",
      JSON.stringify([newCampaign, ...existing])
    );

    navigate("/campaigns");
  };

  return (
    <div className="max-w-xl bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">
        Add Campaign
      </h1>

      <input
        placeholder="Campaign Name"
        className="border p-2 w-full mb-3 rounded"
        onChange={(e) =>
          setForm({ ...form, name: e.target.value })
        }
      />

      <input
        type="number"
        placeholder="Budget"
        className="border p-2 w-full mb-3 rounded"
        onChange={(e) =>
          setForm({ ...form, budget: Number(e.target.value) })
        }
      />

      <select
        className="border p-2 w-full mb-4 rounded"
        onChange={(e) =>
          setForm({ ...form, status: e.target.value })
        }
      >
        <option value="draft">Draft</option>
        <option value="active">Active</option>
        <option value="paused">Paused</option>
        <option value="completed">Completed</option>
      </select>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={handleSave}
      >
        Save Campaign
      </button>
    </div>
  );
}