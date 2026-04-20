import React, { useEffect, useState } from "react";
import Api from "../services/api";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const { setUser } = useAuth();

  const navigate = useNavigate();
  // console.log("hello");
  const fetchUsers = async () => {
    try {
      const res = await Api.get("/auth/users");
      console.log(res);
      const allUser = res.data.data;
      console.log(allUser);
      setUsers(allUser);
    } catch {
      toast.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleStatus = async (id) => {
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
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Admin Dashboard</h2>
      <button
        onClick={handleLogout}
        className="w-full py-2.5 rounded-xl bg-red-500 text-white font-medium shadow hover:bg-red-600 hover:shadow-lg transition-all duration-200">
        Logout
      </button>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="text-center border-t">
              <td className="p-2">{u.username}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.isActive ? "Active" : "Inactive"}</td>

              <td className="flex gap-2 justify-center py-2">
                {/* Toggle Status */}
                <button
                  onClick={() => toggleStatus(u._id)}
                  className="px-2 py-1 bg-yellow-400 rounded">
                  {u.isActive ? "Deactivate" : "Activate"}
                </button>

                {/* Change Role */}
                <button
                  onClick={() => changeRole(u._id, u.role)}
                  className="px-2 py-1 bg-blue-500 text-white rounded">
                  Change Role
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
