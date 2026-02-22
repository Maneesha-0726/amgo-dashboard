import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCampaigns } from "./campaignService";
import type { Campaign, CampaignStatus } from "../../shared/types/campaign";
import Toast from "../../shared/components/Toast";
import ConfirmModal from "../../shared/components/ConfirmModal";
import { useNavigate } from "react-router-dom";

const PAGE_SIZE = 2;

type SortField = "name" | "budget" | null;
type SortOrder = "asc" | "desc";

export default function CampaignList() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filtered, setFiltered] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [undoItem, setUndoItem] = useState<Campaign | null>(null);

  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] =
    useState<CampaignStatus | "all">("all");

  const [sortField] = useState<SortField>(null);
const [sortOrder] = useState<SortOrder>("asc");

  // Load campaigns + restore UI state
  useEffect(() => {
    getCampaigns()
      .then((data) => {
        setCampaigns(data);
        setFiltered(data);
        setLoading(false);

        const saved = localStorage.getItem("campaign-ui-state");
        if (saved) {
          const parsed = JSON.parse(saved);
          setSearch(parsed.search || "");
          setStatusFilter(parsed.statusFilter || "all");
          setPage(parsed.page || 1);
        }
      })
      .catch(() => {
        setError("Failed to load campaigns");
        setLoading(false);
      });
  }, []);

  // Persist UI state
  useEffect(() => {
    const state = { search, statusFilter, page };
    localStorage.setItem("campaign-ui-state", JSON.stringify(state));
  }, [search, statusFilter, page]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  // Search + Filter + Sort
  useEffect(() => {
    let result = campaigns.filter((c) =>
      c.name.toLowerCase().includes(debouncedSearch.toLowerCase())
    );

    if (statusFilter !== "all") {
      result = result.filter((c) => c.status === statusFilter);
    }

    if (sortField) {
      result = [...result].sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];

        if (valA < valB) return sortOrder === "asc" ? -1 : 1;
        if (valA > valB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    setFiltered(result);
  }, [debouncedSearch, campaigns, statusFilter, sortField, sortOrder]);

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

// const updateStatus = (status: CampaignStatus) => {    const updated = campaigns.map((c) =>
//       selected.includes(c.id) ? { ...c, status } : c
//     );

//     setCampaigns(updated);
//     localStorage.setItem("campaigns", JSON.stringify(updated));

//     setSelected([]);
//     setToast(`Updated ${selected.length} campaign(s)`);
//   };

  const handleDelete = () => {
    if (!deleteId) return;

    const deleted = campaigns.find((c) => c.id === deleteId);
    if (!deleted) return;

    const updated = campaigns.filter((c) => c.id !== deleteId);

    setCampaigns(updated);
    setFiltered(updated);
    localStorage.setItem("campaigns", JSON.stringify(updated));

    setUndoItem(deleted);
    setToast("Campaign deleted");
    setDeleteId(null);
  };

  const paginated = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const exportCSV = () => {
    const headers = [
      "id",
      "name",
      "status",
      "budget",
      "impressions",
      "clicks",
    ];

    const rows = campaigns.map((c) =>
      [c.id, c.name, c.status, c.budget, c.impressions, c.clicks].join(",")
    );

    const csv = headers.join(",") + "\n" + rows.join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "campaigns.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Campaigns</h1>
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-14 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Campaigns</h1>

        <div className="flex gap-3">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={() => navigate("/campaigns/new")}
          >
            + Add Campaign
          </button>

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={exportCSV}
          >
            Export CSV
          </button>
        </div>
      </div>

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search campaigns..."
          className="border rounded-lg p-2 w-72"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border rounded-lg p-2"
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as any)
          }
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="draft">Draft</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3"></th>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Budget</th>
            <th className="p-3 text-left">Impressions</th>
            <th className="p-3 text-left">Clicks</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {paginated.map((c) => (
            <tr key={c.id} className="border-t hover:bg-gray-50">
              <td className="p-3 text-center">
                <input
                  type="checkbox"
                  checked={selected.includes(c.id)}
                  onChange={() => toggleSelect(c.id)}
                />
              </td>

              <td className="p-3 text-blue-600 underline">
                <Link to={`/campaigns/${c.id}`}>{c.name}</Link>
              </td>

              <td className="p-3">
                <span
  className={`px-2 py-1 rounded text-white text-sm capitalize
    ${c.status === "active" && "bg-green-600"}
    ${c.status === "paused" && "bg-yellow-500"}
    ${c.status === "draft" && "bg-gray-500"}
    ${c.status === "completed" && "bg-blue-600"}
  `}
>
  {c.status}
</span>
              </td>

              <td className="p-3">${c.budget}</td>
              <td className="p-3">{c.impressions}</td>
              <td className="p-3">{c.clicks}</td>

              <td className="p-3 flex gap-3">
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => navigate(`/campaigns/${c.id}/edit`)}
                >
                  Edit
                </button>

                <button
                  className="text-red-600 hover:underline"
                  onClick={() => setDeleteId(c.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 flex items-center gap-4">
        <button
          className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>

        <span>Page {page}</span>

        <button
          className="bg-gray-200 px-4 py-2 rounded"
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>

      {deleteId && (
        <ConfirmModal
          title="Delete Campaign"
          message="Are you sure you want to delete this campaign?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}

      {toast && (
        <Toast
          message={toast}
          actionLabel="UNDO"
          onAction={() => {
            if (undoItem) {
              const restored = [undoItem, ...campaigns];
              setCampaigns(restored);
              setFiltered(restored);
              localStorage.setItem("campaigns", JSON.stringify(restored));
              setUndoItem(null);
            }
            setToast(null);
          }}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}