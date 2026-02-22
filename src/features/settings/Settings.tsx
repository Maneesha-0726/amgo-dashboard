import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();

  const [profileImage, setProfileImage] = useState(
    localStorage.getItem("profileImage") || ""
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [message, setMessage] = useState("");

  // Load saved settings
  useEffect(() => {
    const saved = JSON.parse(
      localStorage.getItem("settings") || "null"
    );

    if (saved) {
      setName(saved.name || "");
      setEmail(saved.email || "");
      setNotifications(saved.notifications ?? true);
      setDarkMode(saved.darkMode ?? false);
    }
  }, []);

  // ✅ Save settings + notify layout + navigate
  const handleSave = () => {
    const data = {
      name,
      email,
      notifications,
      darkMode,
    };

    localStorage.setItem("settings", JSON.stringify(data));
    setMessage("Settings saved successfully!");

    // 🔥 notify whole app
    window.dispatchEvent(new Event("settingsUpdated"));

    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    setTimeout(() => {
      setMessage("");
      navigate("/campaigns");
    }, 600);
  };

  // Upload image
  const handleImageUpload = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      localStorage.setItem("profileImage", reader.result as string);
      setProfileImage(reader.result as string);

      // 🔥 notify layout
      window.dispatchEvent(new Event("settingsUpdated"));
    };
    reader.readAsDataURL(file);
  };

  // Delete image
  const handleRemoveImage = () => {
    localStorage.removeItem("profileImage");
    setProfileImage("");

    window.dispatchEvent(new Event("settingsUpdated"));
  };

  // ✅ Proper Logout
  const handleLogout = () => {
    localStorage.clear();

    setProfileImage("");
    setName("");
    setEmail("");

    window.dispatchEvent(new Event("settingsUpdated"));

    navigate("/campaigns");
  };

  return (
    <div className="max-w-xl bg-white p-6 rounded shadow">

      <h1 className="text-2xl font-bold mb-4">Settings</h1>

      {message && (
        <p className="text-green-600 mb-3">{message}</p>
      )}

      {/* Profile */}
      <h2 className="font-semibold mb-2">Profile</h2>

      <div className="flex items-center gap-4 mb-4">

        <img
          src={profileImage || "https://via.placeholder.com/100"}
          className="w-24 h-24 rounded-full object-cover border"
        />

        <div className="flex flex-col gap-2">
          <input type="file" onChange={handleImageUpload} />

          {profileImage && (
            <button
              onClick={handleRemoveImage}
              className="text-red-600 text-sm"
            >
              Remove Photo
            </button>
          )}
        </div>
      </div>

      <input
        className="border p-2 w-full mb-3 rounded"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="border p-2 w-full mb-4 rounded"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {/* Preferences */}
      <h2 className="font-semibold mb-2">Preferences</h2>

      <div className="flex items-center gap-2 mb-2">
        <input
          type="checkbox"
          checked={notifications}
          onChange={(e) => setNotifications(e.target.checked)}
        />
        <label>Enable notifications</label>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          checked={darkMode}
          onChange={(e) => setDarkMode(e.target.checked)}
        />
        <label>Dark mode</label>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleSave}
        >
          Save Settings
        </button>

        <button
          className="bg-red-600 text-white px-4 py-2 rounded"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

    </div>
  );
}