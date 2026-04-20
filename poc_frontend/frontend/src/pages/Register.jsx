import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Api from "../services/api";
// import { toast } from "react-toastify";
// import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // const { setUser } = useAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    if (form.password !== form.confirmPassword) {
      return setErrorMsg("Passwords do not match");
    }
    try {
      setLoading(true);
      const res = await Api.post("/auth/register", form);
      if (res?.data && res?.data?.data) {
        // await Api.get("/auth/me")
        //   .then((res) => {
        //     setUser(res?.data?.data);
        //   })
        //   .catch(() => {
        //     setUser(null);
        //   });
        localStorage.setItem("email", form.email);
        navigate("/verify-otp", {
          state: { email: form.email },
        });
      }
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-sm">
          {/* Header */}
          <h2 className="text-2xl font-semibold text-gray-800 mb-1">
            Register
          </h2>
          <p className="text-sm text-gray-400 mb-6">Create a new account</p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
              autoComplete="username"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              autoComplete="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <div>
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                autoComplete="new-password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />

              <p className="text-xs text-gray-500 mt-1">
                Password must be at least 8 characters and include uppercase,
                lowercase, number, and special character.
              </p>
            </div>

            <input
              type="password"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 text-white rounded-lg ${
                loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              }`}>
              {loading ? "Creating..." : "Register"}
            </button>
          </form>

          {/* Login link */}
          <p className="text-center text-sm text-gray-400 mt-6">
            Already have account?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-medium hover:underline">
              Login
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

export default Register;
