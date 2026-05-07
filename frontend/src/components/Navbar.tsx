import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
      <div className="text-xl font-bold text-blue-600">StockFlow</div>

      <div className="flex items-center gap-6">
        <Link className="text-gray-700 hover:text-blue-600" to="/dashboard">
          Dashboard
        </Link>

        <Link className="text-gray-700 hover:text-blue-600" to="/products">
          Products
        </Link>

        <Link className="text-gray-700 hover:text-blue-600" to="/settings">
          Settings
        </Link>

        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;