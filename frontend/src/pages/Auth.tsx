import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../api/axios";

const Auth = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [serverError, setServerError] = useState("");

  const isSignup = mode === "signup";

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      organizationName: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Enter valid email")
        .required("Email is required"),

      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),

      organizationName: isSignup
        ? Yup.string()
            .min(2, "Organization name is too short")
            .required("Organization name is required")
        : Yup.string(),
    }),
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      setServerError("");

      try {
        const endpoint = isSignup ? "/auth/signup" : "/auth/login";

        const payload = isSignup
          ? {
              email: values.email,
              password: values.password,
              organizationName: values.organizationName,
            }
          : {
              email: values.email,
              password: values.password,
            };

        const res = await api.post(endpoint, payload);

        localStorage.setItem("token", res.data.token);
        navigate("/dashboard");
      } catch (err: any) {
        setServerError(
          err.response?.data?.message ||
            `${isSignup ? "Signup" : "Login"} failed`
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  const switchMode = () => {
    setServerError("");
    formik.resetForm();
    setMode(isSignup ? "login" : "signup");
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] flex items-center justify-center px-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        <div className="hidden lg:flex bg-blue-600 p-10 flex-col justify-between text-white">
          <div>
            <h1 className="text-4xl font-bold">StockFlow</h1>
            <p className="mt-4 text-blue-100 text-lg">
              Simple SaaS inventory management for products, stock and low-stock alerts.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-white/10 rounded-2xl p-5">
              <p className="font-semibold">✓ Manage Products</p>
              <p className="text-blue-100 text-sm mt-1">
                Create products with SKU, quantity and prices.
              </p>
            </div>

            <div className="bg-white/10 rounded-2xl p-5">
              <p className="font-semibold">✓ Track Low Stock</p>
              <p className="text-blue-100 text-sm mt-1">
                Dashboard highlights products needing attention.
              </p>
            </div>

            <div className="bg-white/10 rounded-2xl p-5">
              <p className="font-semibold">✓ Organization Scoped</p>
              <p className="text-blue-100 text-sm mt-1">
                Every store sees only its own inventory.
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-12">
          <div className="mb-8">
            <p className="text-sm font-semibold text-blue-600">
              {isSignup ? "CREATE ACCOUNT" : "WELCOME BACK"}
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mt-2">
              {isSignup ? "Create your store" : "Login to your account"}
            </h2>

            <p className="text-gray-500 mt-2">
              {isSignup
                ? "Start managing your inventory in minutes."
                : "Continue managing your inventory."}
            </p>
          </div>

          <div className="bg-gray-100 p-1 rounded-2xl flex mb-6">
            <button
              type="button"
              onClick={() => {
                if (mode !== "login") switchMode();
              }}
              className={`w-1/2 py-3 rounded-xl font-semibold transition ${
                !isSignup
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-500"
              }`}
            >
              Login
            </button>

            <button
              type="button"
              onClick={() => {
                if (mode !== "signup") switchMode();
              }}
              className={`w-1/2 py-3 rounded-xl font-semibold transition ${
                isSignup
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-500"
              }`}
            >
              Signup
            </button>
          </div>

          {serverError && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
              {serverError}
            </div>
          )}

          <form onSubmit={formik.handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>

              <input
                name="email"
                type="email"
                placeholder="vipin@test.com"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full border rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 transition ${
                  formik.touched.email && formik.errors.email
                    ? "border-red-300 focus:ring-red-400"
                    : "border-gray-200 focus:ring-blue-500"
                }`}
              />

              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-sm mt-2">
                  {formik.errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>

              <input
                name="password"
                type="password"
                placeholder="Minimum 6 characters"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full border rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 transition ${
                  formik.touched.password && formik.errors.password
                    ? "border-red-300 focus:ring-red-400"
                    : "border-gray-200 focus:ring-blue-500"
                }`}
              />

              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-sm mt-2">
                  {formik.errors.password}
                </p>
              )}
            </div>

            {isSignup && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Organization Name
                </label>

                <input
                  name="organizationName"
                  placeholder="Vipin Store"
                  value={formik.values.organizationName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full border rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 transition ${
                    formik.touched.organizationName &&
                    formik.errors.organizationName
                      ? "border-red-300 focus:ring-red-400"
                      : "border-gray-200 focus:ring-blue-500"
                  }`}
                />

                {formik.touched.organizationName &&
                  formik.errors.organizationName && (
                    <p className="text-red-500 text-sm mt-2">
                      {formik.errors.organizationName}
                    </p>
                  )}
              </div>
            )}

            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-semibold transition disabled:opacity-60"
            >
              {formik.isSubmitting
                ? isSignup
                  ? "Creating..."
                  : "Logging in..."
                : isSignup
                ? "Create Account"
                : "Login"}
            </button>
          </form>

          <p className="text-center text-gray-500 mt-6">
            {isSignup ? "Already have an account?" : "New to StockFlow?"}{" "}
            <button
              type="button"
              onClick={switchMode}
              className="text-blue-600 font-semibold"
            >
              {isSignup ? "Login" : "Create account"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;