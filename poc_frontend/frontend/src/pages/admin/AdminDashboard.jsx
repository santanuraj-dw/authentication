import React, { useEffect, useState } from "react";
import Api from "../../services/api";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [roles, setRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState({});
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  // const [newRole, setNewRole] = useState("");
  const [confirmUser, setConfirmUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  const { setUser } = useAuth();
  const navigate = useNavigate();

  // all role fetch
  const fetchRoles = async () => {
    try {
      const res = await Api.get("/roles");
      setRoles(res.data.data.roles);
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch roles";
      toast.error(message);
    }
  };

  // all user fetch
  const fetchUsers = async () => {
    try {
      const res = await Api.get("/auth/users", {
        params: {
          page,
          limit: 2,
          search,
          sortBy,
          order,
        },
      });

      setUsers(res.data.data.users);
      setTotalPages(res.data.data.totalPages);
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch users";
      toast.error(message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search, sortBy, order]);

  useEffect(() => {
    fetchRoles();
  }, []);

  const toggleStatus = async (id, currentStatus) => {
    setConfirmUser({ id, currentStatus });

    // try {
    //   await Api.patch(`/auth/admin/status-change/${id}`);
    //   toast.success("User status updated");
    //   fetchUsers();
    // } catch {
    //   toast.error("Failed to update");
    // }
  };

  // const changeRole = async (id, currentRole) => {
  //   const newRole = currentRole === "user" ? "admin" : "user";

  //   try {
  //     await Api.patch(`/auth/admin/change-role/${id}`, {
  //       role: newRole,
  //     });
  //     toast.success("Role updated");
  //     fetchUsers();
  //   } catch {
  //     toast.error("Failed to update role");
  //   }
  // };

  const updateRoles = async (id) => {
    try {
      await Api.patch(`/auth/admin/change-role/${id}`, {
        roles: selectedRoles[id],
      });
      toast.success("Roles updated");
      fetchUsers();
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update roles";
      toast.error(message);
    }
  };

  // const saveRole = async () => {
  //   try {
  //     await Api.post("/roles/", { name: newRole });
  //     toast.success("Role created");
  //     setShowRoleModal(false);
  //     setNewRole("");
  //     fetchRoles();
  //   } catch (error) {
  //     const message = error.response?.data?.message || "Failed";
  //     toast.error(message);
  //   }
  // };

  const handleLogout = async () => {
    await Api.post("/auth/logout");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        {/* <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2> */}

        <div className="flex items-center gap-3 flex-wrap">
          <input
            type="text"
            placeholder="Search user..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(1);
            }}
            className="border px-3 py-2 rounded-lg"
          >
            <option value="createdAt">Default</option>
            <option value="username">Name</option>
            <option value="isActive">Active</option>
            <option value="isVerified">Verified</option>
          </select>

          <select
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            className="border px-3 py-2 rounded-lg"
          >
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>

          {/* <button
            onClick={() => navigate("/roles")}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Manage Roles
          </button>

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Logout
          </button> */}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="p-3">User</th>
              <th className="p-3">Email</th>
              <th className="p-3">Roles</th>
              <th className="p-3">Active</th>
              <th className="p-3">Verified</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t hover:bg-gray-50">
                {/* USER */}
                <td className="p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                    {u.username?.charAt(0).toUpperCase()}
                  </div>
                  {u.username}
                </td>

                <td className="p-3">{u.email}</td>

                {/* <td className="p-3">
                  <select
                    multiple
                    value={selectedRoles[u._id] || []}
                    onChange={(e) => {
                      const values = Array.from(
                        e.target.selectedOptions,
                        (o) => o.value,
                      );
                      setSelectedRoles((prev) => ({
                        ...prev,
                        [u._id]: values,
                      }));
                    }}
                    className="border rounded p-1 w-40 h-20"
                  >
                    {roles.map((r) => (
                      <option key={r._id} value={r._id}>
                        {r.name}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => updateRoles(u._id)}
                    className="block mt-1 text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                  >
                    Save
                  </button>
                </td> */}
                <td className="p-3">
                  <div className="flex flex-wrap gap-1 mb-2">
                    {u.roles.map((r) => (
                      <span
                        key={r._id}
                        className="px-2 py-1 bg-gray-200 text-xs rounded"
                      >
                        {r.name}
                      </span>
                    ))}
                  </div>

                  {/* <div className="border rounded p-2 max-h-24 overflow-y-auto">
                    {roles.map((role) => {
                      const selected =
                        selectedRoles[u._id] || u.roles.map((r) => r._id);

                      return (
                        <label
                          key={role._id}
                          className="flex items-center gap-2 text-sm"
                        >
                          <input
                            type="checkbox"
                            checked={selected.includes(role._id)}
                            onChange={(e) => {
                              const prev =
                                selectedRoles[u._id] ||
                                u.roles.map((r) => r._id);

                              let updated;

                              if (e.target.checked) {
                                updated = [...prev, role._id];
                              } else {
                                updated = prev.filter((id) => id !== role._id);
                              }

                              setSelectedRoles((prevState) => ({
                                ...prevState,
                                [u._id]: updated,
                              }));
                            }}
                          />

                          {role.name}
                        </label>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => updateRoles(u._id)}
                    className="mt-2 px-2 py-1 bg-blue-500 text-white text-xs rounded"
                  >
                    Save
                  </button> */}
                </td>

                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      u.isActive
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {u.isActive ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      u.isVerified
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {u.isVerified ? "Verified" : "Not Verified"}
                  </span>
                </td>

                <td className="p-3 text-center flex gap-2 justify-center">
                  <button
                    onClick={() => toggleStatus(u._id, u.isActive)}
                    className="px-3 py-1 text-xs rounded bg-yellow-400"
                  >
                    {u.isActive ? "Deactivate" : "Activate"}
                  </button>

                  <button
                    onClick={() => {
                      setSelectedUser(u);
                      setSelectedRoles({
                        [u._id]: u.roles.map((r) => r._id),
                      });
                      setShowRoleModal(true);
                    }}
                    className="px-3 py-1 text-xs bg-blue-500 text-white rounded"
                  >
                    Change Role
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="p-6 text-center text-gray-400">No users found</div>
        )}

        <div className="flex justify-center items-center gap-3 p-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="text-sm">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* {showRoleModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow w-80">
            <h3 className="text-lg font-semibold mb-3">Create Role</h3>

            <input
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="border w-full p-2 rounded"
              placeholder="Role name"
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowRoleModal(false)}
                className="px-3 py-1 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={() => saveRole()}
                className="px-3 py-1 bg-blue-500 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )} */}

      {confirmUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow w-80 text-center">
            <p className="mb-4">
              Are you sure you want to{" "}
              <b>{confirmUser.currentStatus ? "Deactivate" : "Activate"}</b>?
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setConfirmUser(null)}
                className="px-3 py-1 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  await Api.patch(
                    `/auth/admin/status-change/${confirmUser.id}`,
                  );
                  toast.success("Updated");
                  setConfirmUser(null);
                  fetchUsers();
                }}
                className="px-3 py-1 bg-yellow-500 rounded"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {showRoleModal && selectedUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow w-96">
            <h3 className="text-lg font-semibold mb-3">
              Change Role - {selectedUser.username}
            </h3>

            <div className="mb-3">
              <p className="text-sm text-gray-500 mb-1">Assigned Roles:</p>
              <div className="flex flex-wrap gap-1">
                {selectedUser.roles.map((r) => (
                  <span
                    key={r._id}
                    className="px-2 py-1 bg-gray-200 text-xs rounded"
                  >
                    {r.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="border rounded p-2 max-h-40 overflow-y-auto">
              {roles.map((role) => {
                const selected = selectedRoles[selectedUser._id] || [];

                return (
                  <label
                    key={role._id}
                    className="flex items-center gap-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={selected.includes(role._id)}
                      onChange={(e) => {
                        let updated;

                        if (e.target.checked) {
                          updated = [...selected, role._id];
                        } else {
                          updated = selected.filter((id) => id !== role._id);
                        }

                        setSelectedRoles((prev) => ({
                          ...prev,
                          [selectedUser._id]: updated,
                        }));
                      }}
                    />
                    {role.name}
                  </label>
                );
              })}
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  setShowRoleModal(false);
                  setSelectedUser(null);
                }}
                className="px-3 py-1 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  await updateRoles(selectedUser._id);
                  setShowRoleModal(false);
                  setSelectedUser(null);
                }}
                className="px-3 py-1 bg-blue-500 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
