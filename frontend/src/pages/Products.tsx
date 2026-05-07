import { useEffect, useState } from "react";
import api from "../api/axios";

interface Product {
  _id: string;
  name: string;
  sku: string;
  description?: string;
  quantityOnHand: number;
  costPrice?: number;
  sellingPrice?: number;
  lowStockThreshold?: number | null;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    sku: "",
    description: "",
    quantityOnHand: "",
    costPrice: "",
    sellingPrice: "",
    lowStockThreshold: "",
  });

  const [error, setError] = useState("");

  const fetchProducts = async () => {
    const res = await api.get("/products");
    setProducts(res.data.products || []);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setForm({
      name: "",
      sku: "",
      description: "",
      quantityOnHand: "",
      costPrice: "",
      sellingPrice: "",
      lowStockThreshold: "",
    });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const payload = {
      name: form.name,
      sku: form.sku,
      description: form.description,
      quantityOnHand: Number(form.quantityOnHand),
      costPrice: form.costPrice ? Number(form.costPrice) : undefined,
      sellingPrice: form.sellingPrice ? Number(form.sellingPrice) : undefined,
      lowStockThreshold: form.lowStockThreshold
        ? Number(form.lowStockThreshold)
        : undefined,
    };

    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
      } else {
        await api.post("/products", payload);
      }

      resetForm();
      fetchProducts();
    } catch (err: any) {
      setError(err.response?.data?.message || "Product save failed");
    }
  };

  const editProduct = (product: Product) => {
    setEditingId(product._id);

    setForm({
      name: product.name,
      sku: product.sku,
      description: product.description || "",
      quantityOnHand: String(product.quantityOnHand),
      costPrice: product.costPrice ? String(product.costPrice) : "",
      sellingPrice: product.sellingPrice ? String(product.sellingPrice) : "",
      lowStockThreshold: product.lowStockThreshold
        ? String(product.lowStockThreshold)
        : "",
    });
  };

  const deleteProduct = async (id: string) => {
    const yes = confirm("Delete this product?");

    if (!yes) return;

    await api.delete(`/products/${id}`);
    fetchProducts();
  };

  const isLowStock = (product: Product) => {
    if (product.lowStockThreshold === undefined || product.lowStockThreshold === null) {
      return false;
    }

    return product.quantityOnHand <= product.lowStockThreshold;
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800">Products</h1>
      <p className="text-gray-500 mt-1">Create and manage your inventory</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">
            {editingId ? "Edit Product" : "Add Product"}
          </h2>

          {error && (
            <div className="mb-4 bg-red-100 text-red-700 px-4 py-2 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <input
              className="w-full border rounded-lg px-4 py-2"
              placeholder="Product Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              className="w-full border rounded-lg px-4 py-2"
              placeholder="SKU"
              value={form.sku}
              onChange={(e) => setForm({ ...form, sku: e.target.value })}
            />

            <textarea
              className="w-full border rounded-lg px-4 py-2"
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <input
              className="w-full border rounded-lg px-4 py-2"
              placeholder="Quantity On Hand"
              type="number"
              value={form.quantityOnHand}
              onChange={(e) =>
                setForm({ ...form, quantityOnHand: e.target.value })
              }
            />

            <input
              className="w-full border rounded-lg px-4 py-2"
              placeholder="Cost Price"
              type="number"
              value={form.costPrice}
              onChange={(e) => setForm({ ...form, costPrice: e.target.value })}
            />

            <input
              className="w-full border rounded-lg px-4 py-2"
              placeholder="Selling Price"
              type="number"
              value={form.sellingPrice}
              onChange={(e) =>
                setForm({ ...form, sellingPrice: e.target.value })
              }
            />

            <input
              className="w-full border rounded-lg px-4 py-2"
              placeholder="Low Stock Threshold"
              type="number"
              value={form.lowStockThreshold}
              onChange={(e) =>
                setForm({ ...form, lowStockThreshold: e.target.value })
              }
            />

            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
              {editingId ? "Update Product" : "Create Product"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg"
              >
                Cancel Edit
              </button>
            )}
          </form>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">Product List</h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3">Name</th>
                  <th className="p-3">SKU</th>
                  <th className="p-3">Qty</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Selling Price</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-b">
                    <td className="p-3">{product.name}</td>
                    <td className="p-3">{product.sku}</td>
                    <td className="p-3">{product.quantityOnHand}</td>
                    <td className="p-3">
                      {isLowStock(product) ? (
                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                          Low Stock
                        </span>
                      ) : (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                          OK
                        </span>
                      )}
                    </td>
                    <td className="p-3">₹{product.sellingPrice || 0}</td>
                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() => editProduct(product)}
                        className="bg-yellow-400 px-3 py-1 rounded-lg"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteProduct(product._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-lg"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {products.length === 0 && (
                  <tr>
                    <td className="p-4 text-gray-500" colSpan={6}>
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;