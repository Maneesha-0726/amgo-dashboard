import { Link, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Layout() {

  const [name, setName] = useState("User");
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {

    const loadProfile = () => {
      const saved = JSON.parse(
        localStorage.getItem("settings") || "null"
      );

      if (saved?.name) {
        setName(saved.name);
      } else {
        setName("User");
      }

      const img = localStorage.getItem("profileImage");
      if (img) {
        setProfileImage(img);
      } else {
        setProfileImage("");
      }
    };

    // Initial load
    loadProfile();

    // 🔥 Listen for custom event from Settings page
    window.addEventListener("settingsUpdated", loadProfile);

    return () => {
      window.removeEventListener("settingsUpdated", loadProfile);
    };

  }, []);

  return (
    <div className="flex min-h-screen">
      
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white p-6">

        <h2 className="text-xl font-bold mb-4">
          Campaign Manager
        </h2>

        {/* Profile Block */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={profileImage || "/avatar.png"}
            className="w-16 h-16 rounded-full object-cover border mb-2"
          />
          <p className="text-sm">{name}</p>
        </div>

        <nav className="space-y-4">
          <Link
            to="/campaigns"
            className="block hover:text-blue-400"
          >
            📊 Campaigns
          </Link>

          <Link
            to="/settings"
            className="block hover:text-blue-400"
          >
            ⚙ Settings
          </Link>
        </nav>

      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </main>

    </div>
  );
}