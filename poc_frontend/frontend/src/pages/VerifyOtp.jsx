import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const { setUser } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || localStorage.getItem("email");

  useEffect(() => {
    if (!email) {
      navigate("/login");
    }
  }, [email, navigate]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  //verify otp
  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otp) {
      toast.error("Enter OTP");
      return;
    }
    try {
      setLoading(true);
      await api.post("/auth/verify-otp", { email, otp });
      // if (res?.data && res?.data?.data){
      //   await api.get("/auth/me")
      //     .then((res) => {
      //       setUser(res?.data?.data);
      //     })
      //     .catch(() => {
      //       // toast.error(error.message)
      //       setUser(null);
      //       // navigate("/verify-otp")
      //     })
      //   }
      localStorage.removeItem("email");
      toast.success("Email verified succesfully");
      navigate("/");
    } catch (error) {
      const msg = error.response?.data?.message || "Invalid OTP";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  //resend otp
  const handleResend = async () => {
    try {
      setResending(true);
      await api.post("/auth/resend-otp", { email });
      toast.success("OTP resent");
      setTimer(60);
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to resend OTP";
      toast.error(msg);
    } finally {
      setResending(false);
    }
  };

  return (
    <div>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-sm">
          <h2 className="text-2xl font-bold pb-3 text-center">Verify OTP</h2>

          <form onSubmit={handleVerify} className="flex flex-row gap-4">
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/, ""))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-20 py-2 text-white rounded-lg ${
                loading ? "bg-gray-400" : "bg-blue-600"
              }`}>
              {loading ? "..." : "Verify"}
            </button>
          </form>

          <br />

          <button
            onClick={handleResend}
            disabled={timer > 0 || resending}
            className="text-blue-500">
            {resending
              ? "Sending..."
              : timer > 0
                ? `Resend in ${timer}s`
                : "Resend OTP"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
