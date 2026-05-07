import { useEffect, useState } from "react";
import api from "../api/axios";

const Settings = () => {
  const [defaultLowStockThreshold, setDefaultLowStockThreshold] = useState("");
  const [message, setMessage] = useState("");

  const fetchSettings = async () => {
    const res = await api.get("/settings");

    setDefaultLowStockThreshold(
      String(res.data.settings?.defaultLowStockThreshold ?? 5)
    );
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    await api.put("/settings", {
      defaultLowStockThreshold: Number(defaultLowStockThreshold),
    });

    setMessage("Settings updated successfully");
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
      <p className="text-gray-500 mt-1">
        Manage global inventory configuration
      </p>

      <div className="bg-white rounded-2xl shadow p-6 mt-8 max-w-lg">
        <h2 className="text-xl font-bold mb-4">
          Default Low Stock Threshold
        </h2>

        {message && (
          <div className="mb-4 bg-green-100 text-green-700 px-4 py-2 rounded-lg">
            {message}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <input
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="number"
            min="0"
            value={defaultLowStockThreshold}
            onChange={(e) => setDefaultLowStockThreshold(e.target.value)}
          />

          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700">
            Save Settings
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;