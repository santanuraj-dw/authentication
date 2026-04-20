import React from "react";
import { useNavigate } from "react-router-dom";
import Api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user, setUser } = useAuth();
  // console.log(user)
  const navigate = useNavigate();

  const handleLogout = async () => {
    await Api.post("/auth/logout");
    setUser(null);
    navigate("/login");
  };

  const handleVerify = () => {
    // navigate("/login");
    navigate("/verify-email", {
      state: { email: user.email },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center px-4">
      <div className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-3xl shadow-xl p-8 w-full max-w-sm flex flex-col items-center gap-6 transition-all duration-300 hover:shadow-2xl">
        {!user?.isVerified && (
          <div className="w-full bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl flex items-center justify-between">
            <span>Email not verified</span>
            <button
              onClick={handleVerify}
              className="text-xs font-semibold bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 hover:cursor-pointer transition">
              Verify
            </button>
          </div>
        )}

        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-3xl font-bold text-white shadow-md">
          {user.username?.charAt(0).toUpperCase()}
        </div>

        <div className="text-center">
          <p className="text-gray-400 text-sm">Welcome back</p>
          <h2 className="text-2xl font-semibold text-gray-800 mt-1">
            Hello, {user.username} 👋
          </h2>
          <p className="text-xs text-gray-400 mt-1">{user.email}</p>
        </div>

        <button
          onClick={handleLogout}
          className="w-full py-2.5 rounded-xl bg-red-500 text-white font-medium shadow hover:bg-red-600 hover:shadow-lg transition-all duration-200">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
