import React, { useEffect, useState } from "react";
import Api from "../services/api";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const res = await Api.get("/auth/users");
      setUsers(res.data.data);
    } catch {
      toast.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleStatus = async (id, currentStatus) => {
    const confirmAction = window.confirm(
      `Are you sure you want to ${currentStatus ? "deactivate" : "activate"} this user?`
    );

    if (!confirmAction) return;

    try {
      await Api.patch(`/auth/admin/status-change/${id}`);
      toast.success("User status updated");
      fetchUsers();
    } catch {
      toast.error("Failed to update");
    }
  };

  const changeRole = async (id, currentRole) => {
    const newRole = currentRole === "user" ? "admin" : "user";

    try {
      await Api.patch(`/auth/admin/change-role/${id}`, {
        role: newRole,
      });
      toast.success("Role updated");
      fetchUsers();
    } catch {
      toast.error("Failed to update role");
    }
  };

  const handleLogout = async () => {
    await Api.post("/auth/logout");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Admin Dashboard
        </h2>

        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm text-left">

          {/* Head */}
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="p-3">User</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Active Status</th>
              <th className="p-3">Email Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {users.map((u) => (
              <tr
                key={u._id}
                className="border-t hover:bg-gray-50 transition"
              >
                {/* Username with avatar */}
                <td className="p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                    {u.username?.charAt(0).toUpperCase()}
                  </div>
                  {u.username}
                </td>

                <td className="p-3">{u.email}</td>

                {/* Role Badge */}
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${u.role === "admin"
                      ? "bg-purple-100 text-purple-600"
                      : "bg-gray-200 text-gray-700"
                      }`}
                  >
                    {u.role}
                  </span>
                </td>

                {/* Status Badge */}
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${u.isActive
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                      }`}
                  >
                    {u.isActive ? "Active" : "Inactive"}
                  </span>
                </td>

                {/* Status Badge */}
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${u.isVerified
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                      }`}
                  >
                    {u.isVerified ? "verified" : "not verified"}
                  </span>
                </td>

                {/* Actions */}
                <td className="p-3">
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => toggleStatus(u._id, u.isActive)}
                      className="px-3 py-1 text-xs rounded bg-yellow-400 hover:bg-yellow-500"
                    >
                      {u.isActive ? "Deactivate" : "Activate"}
                    </button>

                    <button
                      onClick={() => changeRole(u._id, u.role)}
                      className="px-3 py-1 text-xs rounded bg-blue-500 text-white hover:bg-blue-600"
                    >
                      Change Role
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>

        </table>

        {/* Empty State */}
        {users.length === 0 && (
          <div className="p-6 text-center text-gray-400">
            No users found
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;