import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Api from "../services/api";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      setLoading(true);

      await Api.post("/auth/login", form);

      const res = await Api.get("/auth/me");
      const userData = res?.data?.data;
      // console.log(userData.roles[0].name)
      setUser(userData);

      toast.success("Login successful");

      if (userData.roles[0].name === "Admin") {
        // console.log("hello")
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-sm">
          <h2 className="text-2xl font-semibold text-gray-800 mb-1">Login</h2>
          <p className="text-sm text-gray-400 mb-6">
            Sign in to your account
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              required
              autoComplete="email"
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
            />

            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              required
              autoComplete="current-password"
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
            />

            <p className="text-right text-sm">
              <span
                onClick={() => !loading && navigate("/forgot-password")}
                className="text-blue-600 cursor-pointer hover:underline"
              >
                Forgot Password?
              </span>
            </p>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded text-white font-medium transition ${loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            No account?{" "}
            <Link
              to="/register"
              className="text-blue-600 font-medium hover:underline"
            >
              Register
            </Link>
          </p>

          {errorMsg && (
            <div className="mt-3 p-2 text-sm text-red-600 bg-red-100 border border-red-300 rounded">
              {errorMsg}

              {errorMsg === "Please verify your email first" && (
                <div className="mt-2">
                  <span
                    onClick={() => navigate("/verify-email", { state: { email: form.email } })}
                    className="text-blue-600 cursor-pointer hover:underline block"
                  >
                    Click here to verify your email
                  </span>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Login;