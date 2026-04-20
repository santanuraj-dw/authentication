import React, { useState } from "react";
import Api from "../services/api";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || localStorage.getItem("resetEmail");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      return setError("Invalid access. Please start again.");
    }

    if (password !== confirm) {
      return setError("Passwords do not match");
    }

    try {
      setLoading(true);

      await Api.post("/auth/reset-password", {
        email,
        otp,
        newPassword:password,
      });

      toast.success("Password reset successful");
      localStorage.removeItem("resetEmail");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        className="bg-white p-6 rounded-xl shadow w-80"
        onSubmit={handleSubmit}>
        <h2 className="text-xl font-semibold mb-4 text-center">
          Reset Password
        </h2>

        {/* Email */}
        <input
          type="email"
          value={email || ""}
          disabled
          className="w-full p-2 border rounded mb-3 bg-gray-100"
        />

        {/* OTP */}
        <input
          type="text"
          placeholder="Enter OTP"
          className="w-full p-2 border rounded mb-3"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          disabled={loading}
        />

        {/* Password */}
        <input
          type="password"
          placeholder="New Password"
          className="w-full p-2 border rounded mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />

        {/* Confirm */}
        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full p-2 border rounded mb-3"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          disabled={loading}
        />

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded text-white transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}>
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Processing...
            </span>
          ) : (
            "Reset Password"
          )}
        </button>

        {/* Error */}
        {error && (
          <p className="text-red-500 mt-2 text-sm text-center">{error}</p>
        )}
      </form>
    </div>
  );
};

export default ResetPassword;
