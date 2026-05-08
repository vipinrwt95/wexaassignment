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
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    const res = await api.get("/products");
    setProducts(res.data.products || []);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setError("");

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

    if (!form.name.trim()) {
      setError("Product name is required");
      return;
    }

    if (!form.sku.trim()) {
      setError("SKU is required");
      return;
    }

    setLoading(true);
    setError("");

    const payload = {
      name: form.name.trim(),
      sku: form.sku.trim(),
      description: form.description.trim(),
      quantityOnHand: form.quantityOnHand
        ? Number(form.quantityOnHand)
        : 0,
      costPrice: form.costPrice ? Number(form.costPrice) : undefined,
      sellingPrice: form.sellingPrice
        ? Number(form.sellingPrice)
        : undefined,
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
    } finally {
      setLoading(false);
    }
  };

  const editProduct = (product: Product) => {
    setEditingId(product._id);
    setError("");

    setForm({
      name: product.name,
      sku: product.sku,
      description: product.description || "",
      quantityOnHand: String(product.quantityOnHand),
      costPrice: product.costPrice ? String(product.costPrice) : "",
      sellingPrice: product.sellingPrice
        ? String(product.sellingPrice)
        : "",
      lowStockThreshold: product.lowStockThreshold
        ? String(product.lowStockThreshold)
        : "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteProduct = async (id: string) => {
    const yes = confirm("Delete this product?");
    if (!yes) return;

    await api.delete(`/products/${id}`);
    fetchProducts();
  };

  const adjustStock = async (productId: string, adjustment: number) => {
    await api.post(`/products/${productId}/adjust-stock`, {
      adjustment,
    });

    fetchProducts();
  };

  const isLowStock = (product: Product) => {
    if (
      product.lowStockThreshold === undefined ||
      product.lowStockThreshold === null
    ) {
      return false;
    }

    return product.quantityOnHand <= product.lowStockThreshold;
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            Inventory Management
          </h1>

          <p className="text-gray-500 mt-2 text-lg">
            Manage products, pricing and stock levels
          </p>
        </div>

        <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Total Products</p>
          <h2 className="text-3xl font-bold text-blue-600 mt-1">
            {products.length}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 h-fit sticky top-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {editingId ? "Edit Product" : "Add Product"}
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                {editingId
                  ? "Update product details"
                  : "Create a new inventory item"}
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Product Name <span className="text-red-500">*</span>
              </label>

              <input
                required
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Enter product name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                SKU <span className="text-red-500">*</span>
              </label>

              <input
                required
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter SKU"
                value={form.sku}
                onChange={(e) =>
                  setForm({ ...form, sku: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>

              <textarea
                rows={3}
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Product description"
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Quantity
                </label>

                <input
                  type="number"
                  min="0"
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                  value={form.quantityOnHand}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      quantityOnHand: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Threshold
                </label>

                <input
                  type="number"
                  min="0"
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="5"
                  value={form.lowStockThreshold}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      lowStockThreshold: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Cost Price
                </label>

                <input
                  type="number"
                  min="0"
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                  value={form.costPrice}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      costPrice: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Selling Price
                </label>

                <input
                  type="number"
                  min="0"
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                  value={form.sellingPrice}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      sellingPrice: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-semibold transition disabled:opacity-60"
            >
              {loading
                ? "Saving..."
                : editingId
                ? "Update Product"
                : "Create Product"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-2xl font-semibold transition"
              >
                Cancel Edit
              </button>
            )}
          </form>
        </div>

        <div className="xl:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Product Inventory
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                View and manage all inventory products
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 text-left text-sm text-gray-500">
                  <th className="pb-4 font-semibold">Product</th>
                  <th className="pb-4 font-semibold">Stock</th>
                  <th className="pb-4 font-semibold">Status</th>
                  <th className="pb-4 font-semibold">Selling Price</th>
                  <th className="pb-4 font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr
                    key={product._id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition"
                  >
                    <td className="py-5">
                      <div>
                        <p className="font-semibold text-gray-900 text-lg">
                          {product.name}
                        </p>

                        <p className="text-sm text-gray-500 mt-1">
                          SKU: {product.sku}
                        </p>
                      </div>
                    </td>

                    <td className="py-5">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => adjustStock(product._id, -10)}
                          className="w-9 h-9 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xl font-bold"
                        >
                          -
                        </button>

                        <div className="min-w-[70px] text-center">
                          <p className="text-xl font-bold text-gray-900">
                            {product.quantityOnHand}
                          </p>
                        </div>

                        <button
                          onClick={() => adjustStock(product._id, 10)}
                          className="w-9 h-9 rounded-xl bg-green-50 hover:bg-green-100 text-green-600 text-xl font-bold"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    <td className="py-5">
                      {isLowStock(product) ? (
                        <span className="px-4 py-2 rounded-full bg-red-100 text-red-700 text-sm font-semibold">
                          Low Stock
                        </span>
                      ) : (
                        <span className="px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
                          Healthy
                        </span>
                      )}
                    </td>

                    <td className="py-5">
                      <p className="font-semibold text-gray-900 text-lg">
                        ₹{product.sellingPrice || 0}
                      </p>
                    </td>

                    <td className="py-5">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => editProduct(product)}
                          className="px-5 py-2 rounded-xl bg-yellow-100 hover:bg-yellow-200 text-yellow-700 font-semibold transition"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => deleteProduct(product._id)}
                          className="px-5 py-2 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 font-semibold transition"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {products.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-12 text-center text-gray-400"
                    >
                      No products found
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