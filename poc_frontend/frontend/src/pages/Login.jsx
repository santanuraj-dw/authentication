import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Api from "../services/api";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const { setUser } = useAuth();

 const handleSubmit = async (e) => {
  e.preventDefault();
  setErrorMsg("");

  try {
    await Api.post("/auth/login", form);

    // 🔥 always fetch user
    const res = await Api.get("/auth/me");
    const userData = res?.data?.data;
    // console.log(userData)
    setUser(userData);

    toast.success("Login successful");

    if (userData.role === "admin") {
      console.log("admin")
      navigate("/admin");
    } else {
      navigate("/");
    }

  } catch (error) {
    const message = error.response?.data?.message || "Login failed";
    setErrorMsg(message);
  }
};
  return (
    <div>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-sm">
          {/* Header */}
          <h2 className="text-2xl font-semibold text-gray-800 mb-1">Login</h2>
          <p className="text-sm text-gray-400 mb-6">Sign in to your account</p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              autoComplete="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              autoComplete="current-password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200">
              Login
            </button>
          </form>

          {/* Register link */}
          <p className="text-center text-sm text-gray-400 mt-6">
            No account?{" "}
            <Link
              to="/register"
              className="text-blue-600 font-medium hover:underline">
              Register
            </Link>
          </p>
          {errorMsg && (
            <div className="mb-4 mt-2 p-2 text-sm text-red-600 bg-red-100 border border-red-300 rounded">
              {errorMsg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
