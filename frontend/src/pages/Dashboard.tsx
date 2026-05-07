import { useEffect, useState } from "react";
import api from "../api/axios";

interface Product {
  _id: string;
  name: string;
  sku: string;
  quantityOnHand: number;
  lowStockThreshold?: number | null;
}

const Dashboard = () => {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [lowStockItems, setLowStockItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/dashboard");

      setTotalProducts(res.data.totalProducts || 0);
      setTotalQuantity(res.data.totalQuantityOnHand || 0);
      setLowStockItems(res.data.lowStockItems || []);
    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="p-8">Loading dashboard...</div>;
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
      <p className="text-gray-500 mt-1">Inventory summary overview</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-gray-500">Total Products</p>
          <h2 className="text-4xl font-bold text-blue-600 mt-2">
            {totalProducts}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-gray-500">Total Quantity On Hand</p>
          <h2 className="text-4xl font-bold text-green-600 mt-2">
            {totalQuantity}
          </h2>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow mt-8 p-6">
        <h2 className="text-xl font-bold text-gray-800">Low Stock Items</h2>

        {lowStockItems.length === 0 ? (
          <p className="text-gray-500 mt-4">No low stock products.</p>
        ) : (
          <div className="overflow-x-auto mt-4">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3">Name</th>
                  <th className="p-3">SKU</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Threshold</th>
                </tr>
              </thead>

              <tbody>
                {lowStockItems.map((item) => (
                  <tr key={item._id} className="border-b">
                    <td className="p-3">{item.name}</td>
                    <td className="p-3">{item.sku}</td>
                    <td className="p-3 text-red-600 font-semibold">
                      {item.quantityOnHand}
                    </td>
                    <td className="p-3">{item.lowStockThreshold ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;