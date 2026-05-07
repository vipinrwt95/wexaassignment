import { useEffect, useState } from "react";
import api from "../api/axios";

interface Product {
  _id?: string;
  id?: string;
  name: string;
  sku: string;
  quantityOnHand: number;
  lowStockThreshold?: number | null;
}

const Dashboard = () => {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [lowStockItems, setLowStockItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/dashboard");

      setTotalProducts(res.data.summary?.totalProducts || 0);
      setTotalQuantity(res.data.summary?.totalQuantityOnHand || 0);
      setLowStockCount(res.data.summary?.lowStockCount || 0);
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
    return (
      <div className="min-h-screen bg-[#f5f7fb] p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-10 w-64 bg-gray-200 rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-32 bg-white rounded-3xl" />
            <div className="h-32 bg-white rounded-3xl" />
            <div className="h-32 bg-white rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb] p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-2 text-lg">
            Real-time overview of your inventory health
          </p>
        </div>

        <div className="hidden md:block bg-white border border-gray-100 rounded-2xl px-6 py-4 shadow-sm">
          <p className="text-sm text-gray-500">Inventory Status</p>
          <p className="text-lg font-bold text-gray-900 mt-1">
            {lowStockCount > 0 ? "Needs Attention" : "Healthy"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-7">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 font-medium">Total Products</p>
              <h2 className="text-5xl font-bold text-blue-600 mt-4">
                {totalProducts}
              </h2>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-2xl">
              📦
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-7">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 font-medium">Quantity On Hand</p>
              <h2 className="text-5xl font-bold text-green-600 mt-4">
                {totalQuantity}
              </h2>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-2xl">
              📊
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-7">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 font-medium">Low Stock Items</p>
              <h2 className="text-5xl font-bold text-red-600 mt-4">
                {lowStockCount}
              </h2>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center text-2xl">
              ⚠️
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 mt-8 p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Low Stock Items
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Products where quantity is less than or equal to threshold
            </p>
          </div>

          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold ${
              lowStockCount > 0
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {lowStockCount > 0 ? `${lowStockCount} Alert` : "All Good"}
          </span>
        </div>

        {lowStockItems.length === 0 ? (
          <div className="py-14 text-center">
            <div className="w-16 h-16 rounded-full bg-green-50 mx-auto flex items-center justify-center text-3xl">
              ✅
            </div>
            <h3 className="text-xl font-bold text-gray-900 mt-4">
              No low stock products
            </h3>
            <p className="text-gray-500 mt-2">
              Your inventory levels are healthy.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 text-left text-sm text-gray-500">
                  <th className="pb-4 font-semibold">Product</th>
                  <th className="pb-4 font-semibold">SKU</th>
                  <th className="pb-4 font-semibold">Quantity On Hand</th>
                  <th className="pb-4 font-semibold">Low Stock Threshold</th>
                  <th className="pb-4 font-semibold">Status</th>
                </tr>
              </thead>

              <tbody>
                {lowStockItems.map((item) => (
                  <tr
                    key={item._id || item.id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition"
                  >
                    <td className="py-5">
                      <p className="font-semibold text-gray-900 text-lg">
                        {item.name}
                      </p>
                    </td>

                    <td className="py-5">
                      <span className="px-3 py-1 rounded-lg bg-gray-100 text-gray-700 font-semibold text-sm">
                        {item.sku}
                      </span>
                    </td>

                    <td className="py-5">
                      <p className="text-xl font-bold text-red-600">
                        {item.quantityOnHand}
                      </p>
                    </td>

                    <td className="py-5">
                      <p className="text-lg font-semibold text-gray-900">
                        {item.lowStockThreshold ?? "-"}
                      </p>
                    </td>

                    <td className="py-5">
                      <span className="px-4 py-2 rounded-full bg-red-100 text-red-700 text-sm font-semibold">
                        Low Stock
                      </span>
                    </td>
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