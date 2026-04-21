import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Api from "../services/api";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const EmailVerify = () => {
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const initialEmail = location.state?.email || "";

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(0);

  const { setUser } = useAuth();

  const startTimer = () => {
    setTimer(60);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOtp = async () => {
    if (!email) {
      return toast.error("Email is required");
    }

    try {
      setSending(true);
      await Api.post("/auth/resend-otp", { email });

      toast.success("OTP sent successfully");
      setOtpSent(true);
      setOtp("");
      startTimer();
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to send OTP";
      toast.error(msg);
    } finally {
      setSending(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      setVerifying(true);
      await Api.post("/auth/verify-otp", { email, otp });

      toast.success("Email verified successfully");
      // const res = await Api.get("/auth/me");
      // setUser(res.data.data);
      // toast.success("Email verified sucessfully")
      navigate("/login");
    } catch (error) {
      const msg = error.response?.data?.message || "Invalid OTP";
      toast.error(msg);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-4 text-center">Verify Email</h2>

        <input
          type="email"
          placeholder="Enter email"
          value={email}
          disabled={otpSent}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 px-3 py-2 border rounded"
        />

        {/* SEND OTP BUTTON */}
        {!otpSent && (
          <button
            onClick={handleSendOtp}
            disabled={sending || !email}
            className={`w-full py-2 rounded mb-3 text-white ${sending ? "bg-gray-400" : "bg-blue-500"
              }`}
          >
            {sending ? "Sending..." : "Send OTP"}
          </button>
        )}

        {/* OTP SECTION */}
        {otpSent && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full mb-3 px-3 py-2 border rounded"
            />

            <button
              onClick={handleVerify}
              disabled={verifying}
              className={`w-full py-2 rounded mb-2 text-white ${verifying ? "bg-gray-400" : "bg-green-500"
                }`}
            >
              {verifying ? "Verifying..." : "Verify OTP"}
            </button>

            {/* RESEND BUTTON */}
            <button
              disabled={timer > 0}
              onClick={handleSendOtp}
              className={`w-full text-sm ${timer > 0 ? "text-gray-400" : "text-blue-600"
                }`}
            >
              {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default EmailVerify;
