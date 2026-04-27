import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { hasPermission } from "../utils/authorize";
import { PERMISSIONS } from "../constants/permissions";
import { toast } from "react-toastify";
import { Pencil } from "lucide-react";

const Dashboard = () => {
  const { user, setUser } = useAuth();
  // console.log(user)
  const navigate = useNavigate();

  // const handleLogout = async () => {
  //   await Api.post("/auth/logout");
  //   setUser(null);
  //   navigate("/login");
  // };

  // const handleVerify = () => {
  //   // navigate("/login");
  //   navigate("/verify-email", {
  //     state: { email: user.email },
  //   });
  // };
  const [sendingOtp, setSendingOtp] = useState(false);
  const [modalType, setModalType] = useState(null); // "username" | "email"

  const [otpSent, setOtpSent] = useState(false);
  const [showPasswordBox, setShowPasswordBox] = useState(false);

  const [profileForm, setProfileForm] = useState({
    username: "",
    email: "",
    otp: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handlePasswordChangeInput = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      const res = await Api.patch("/user/change-password", {
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      });

      toast.success(res.data.message);

      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setShowPasswordBox(false);
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };

  const handleUsernameUpdate = async (e) => {
    e.preventDefault();

    try {
      const res = await Api.patch("/user/change-username", {
        username: profileForm.username,
      });

      setUser(res.data.user);
      toast.success("Username updated");
      setModalType(null);
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };

  const handleSendOtp = async () => {
    if (!profileForm.email) {
      return toast.error("Email is required");
    }

    try {
      setSendingOtp(true);

      await Api.post("/user/send-email-otp", {
        email: profileForm.email,
      });

      toast.success("OTP sent to email");
      setOtpSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyEmail = async (e) => {
    e.preventDefault();

    try {
      console.log(profileForm.email);
      const res = await Api.patch("/user/verify-change-email", {
        email: profileForm.email,
        otp: profileForm.otp,
      });
      
      const me = await Api.get("/auth/me");

      setUser(me.data.data);
      toast.success("Email updated successfully");
      setModalType(null);
      setOtpSent(false);
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center px-4">
      <div className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-3xl shadow-xl p-8 w-full max-w-sm flex flex-col items-center gap-6 transition-all duration-300 hover:shadow-2xl">
        {/* {!user?.isVerified && (
          <div className="w-full bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl flex items-center justify-between">
            <span>Email not verified</span>
            <button
              onClick={handleVerify}
              className="text-xs font-semibold bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 hover:cursor-pointer transition"
            >
              Verify
            </button>
          </div>
        )} */}

        {/* {hasPermission(user, [PERMISSIONS.ROLE_READ]) && (
          <button
            onClick={() => navigate("/roles")}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Manage Roles
          </button>
        )} */}

        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-3xl font-bold text-white shadow-md">
          {user.username?.charAt(0).toUpperCase()}
        </div>

        <div className="text-center">
          <p className="text-gray-400 text-sm">Welcome back</p>
          <div className="flex items-center">
            <h2 className="text-2xl font-semibold text-gray-800 mt-1 px-3">
              Hello, {user.username}
            </h2>
            <Pencil
              className="cursor-pointer"
              size={18}
              onClick={() => setModalType("username")}
            />
          </div>
          <div className="flex items-center">
            <p className="text-xs text-gray-400 mt-1 px-3">{user.email}</p>
            <Pencil
              className="cursor-pointer"
              size={13}
              onClick={() => setModalType("email")}
            />
          </div>
        </div>

        {/* <button
          onClick={handleLogout}
          className="w-full py-2.5 rounded-xl bg-red-500 text-white font-medium shadow hover:bg-red-600 hover:shadow-lg transition-all duration-200"
        >
          Logout
        </button> */}
        <button
          onClick={() => setModalType("password")}
          className="w-full py-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition"
        >
          change password
        </button>

        {/* {showPasswordBox && (
          <form
            onSubmit={handlePasswordChange}
            className="mt-5 flex flex-col gap-4"
          >
            <input
              type="password"
              name="oldPassword"
              placeholder="Old Password"
              value={form.oldPassword}
              onChange={handleChange}
              className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />

            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={form.newPassword}
              onChange={handleChange}
              className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm New Password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />

            <button
              type="submit"
              className="bg-green-500 text-white py-2 rounded-xl hover:bg-green-600"
            >
              Update Password
            </button>
          </form>
        )} */}
      </div>
      {modalType && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl animate-fadeIn">
            <h2 className="text-lg font-semibold mb-4 text-center capitalize">
              Change {modalType}
            </h2>

            {/* PASSWORD FORM */}
            {modalType === "password" && (
              <form
                onSubmit={handlePasswordChange}
                className="flex flex-col gap-3"
              >
                <input
                  type="password"
                  name="oldPassword"
                  placeholder="Old Password"
                  onChange={handlePasswordChangeInput}
                  className="border p-2 rounded"
                  required
                />
                <input
                  type="password"
                  name="newPassword"
                  placeholder="New Password"
                  onChange={handlePasswordChangeInput}
                  className="border p-2 rounded"
                  required
                />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  onChange={handlePasswordChangeInput}
                  className="border p-2 rounded"
                  required
                />

                <button className="bg-indigo-500 text-white py-2 rounded">
                  Update
                </button>
              </form>
            )}

            {/* EMAIL FORM */}
            {modalType === "email" && (
              <div className="flex flex-col gap-3">
                <input
                  type="email"
                  name="email"
                  placeholder="New Email"
                  onChange={handleProfileChange}
                  className="border p-2 rounded"
                />

                {!otpSent ? (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={sendingOtp}
                    className={`py-2 rounded text-white ${
                      sendingOtp
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-yellow-500"
                    }`}
                  >
                    {sendingOtp ? "Sending..." : "Send OTP"}
                  </button>
                ) : (
                  <>
                    <input
                      type="text"
                      name="otp"
                      placeholder="Enter OTP"
                      onChange={handleProfileChange}
                      className="border p-2 rounded"
                    />

                    <button
                      type="button"
                      onClick={handleVerifyEmail}
                      className="bg-green-500 text-white py-2 rounded"
                    >
                      Verify & Update
                    </button>
                  </>
                )}
              </div>
            )}

            {/* USERNAME FORM */}
            {modalType === "username" && (
              <form
                onSubmit={handleUsernameUpdate}
                className="flex flex-col gap-3"
              >
                <input
                  type="text"
                  name="username"
                  placeholder="New Username"
                  onChange={handleProfileChange}
                  className="border p-2 rounded"
                  required
                />

                <button className="bg-green-500 text-white py-2 rounded">
                  Update
                </button>
              </form>
            )}

            {/* Close */}
            <button
              onClick={() => {
                setModalType(null);
                setOtpSent(false);
                setProfileForm({ username: "", email: "", otp: "" });
                setPasswordForm({
                  oldPassword: "",
                  newPassword: "",
                  confirmPassword: "",
                });
              }}
              className="mt-4 text-sm text-gray-500 w-full"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
