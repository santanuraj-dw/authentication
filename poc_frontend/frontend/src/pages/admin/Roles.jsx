import React, { useEffect, useState } from "react";
import Api from "../../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { hasPermission } from "../../utils/authorize";
import { useAuth } from "../../context/AuthContext";
import { PERMISSIONS } from "../../constants/permissions";
import { groupPermissions } from "../../utils/groupPermissions";
import UserFilters from "../../components/otherComponents/UserFilters";
import Pagination from "../../components/otherComponents/Pagination";

const RolesPage = () => {
  const [roles, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [confirmRole, setConfirmRole] = useState(null);
  const [editRole, setEditRole] = useState(null);
  const [roleName, setRoleName] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [groupedPermissions, setGroupedPermissions] = useState({});

  const { user } = useAuth();

  const navigate = useNavigate();

  const fetchRoles = async () => {
    try {
      const res = await Api.get("/roles", {
        params: {
          page,
          limit: 10,
          search,
          sortBy,
          order,
        },
      });
      // console.log(res.data.data.roles);
      setRoles(res.data.data.roles);
      setTotalPages(res.data.data.totalPages);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch roles");
    }
  };

  const fetchPermissions = async () => {
    try {
      const res = await Api.get("/permissions");

      const data = res.data.data.data;
      // console.log(data)
      const excludedPermissions = ["permissions:read"];

      const filteredData = data
        .map((module) => ({
          ...module,
          permissions: module.permissions.filter(
            (p) => !excludedPermissions.includes(p.name),
          ),
        }))
        .filter((module) => module.permissions.length > 0);

      setGroupedPermissions(
        filteredData.reduce((acc, module) => {
          acc[module._id] = module.permissions;
          return acc;
        }, {}),
      );

      setPermissions(filteredData);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch permissions",
      );
    }
  };

  useEffect(() => {
    fetchRoles();
  }, [page, search, sortBy, order]);

  useEffect(() => {
    fetchPermissions();
  }, []);

  const saveRole = async () => {
    try {
      if (editRole) {
        // console.log("edit role");
        await Api.patch(`/roles/${editRole._id}`, {
          name: roleName,
          permissions: selectedPermissions,
        });
        toast.success("Role updated");
      } else {
        // console.log("create role");
        await Api.post("/roles", {
          name: roleName,
          permissions: selectedPermissions,
        });
        toast.success("Role created");
      }

      setShowModal(false);
      setRoleName("");
      setSelectedPermissions([]);
      setEditRole(null);
      fetchRoles();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed");
    }
  };

  const toggleStatus = (id, currentStatus) => {
    setConfirmRole({ id, currentStatus });
  };

  const isAllSelected = (module) => {
    const modulePerms = groupedPermissions[module].map((p) => p._id);

    return modulePerms.every((id) => selectedPermissions.includes(id));
  };

  const toggleModule = (module) => {
    const modulePerms = groupedPermissions[module].map((p) => p._id);

    const allSelected = modulePerms.every((id) =>
      selectedPermissions.includes(id),
    );

    if (allSelected) {
      setSelectedPermissions((prev) =>
        prev.filter((id) => !modulePerms.includes(id)),
      );
    } else {
      setSelectedPermissions((prev) => [...new Set([...prev, ...modulePerms])]);
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setOrder("asc");
    }
  };

  const getArrow = (field) => {
    if (sortBy !== field) return "↕️";
    return order === "asc" ? "⬆️" : "⬇️";
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        {/* <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin")}
            className="px-3 py-1 bg-gray-300 rounded"
          >
            ← Back
          </button>

          <h2 className="text-2xl font-bold">Roles Management</h2>
        </div> */}

        <UserFilters
          search={search}
          setSearch={setSearch}
          placeholder="Search role..."
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
        />

        {/* <div className="flex items-center gap-3 flex-wrap">
          <input
            type="text"
            placeholder="Search role..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            className="border px-3 py-2 rounded"
          />
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(1);
            }}
            className="border px-2 py-2 rounded"
          >
            <option value="createdAt">Default</option>
            <option value="name">Name</option>
            <option value="isActive">Status</option>
          </select>

          <select
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            className="border px-2 py-2 rounded"
          >
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
        </div> */}
        {/* {user && hasPermission(user, [PERMISSIONS.ROLE_CREATE]) && ( */}
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          + Create Role
        </button>
        {/* )} */}
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-200">
            <tr>
              <th
                className="p-3 cursor-pointer"
                onClick={() => handleSort("name")}
              >
                Role {getArrow("name")}
              </th>

              <th className="p-3">Permissions</th>

              <th
                className="p-3 cursor-pointer"
                onClick={() => handleSort("isActive")}
              >
                Status {getArrow("isActive")}
              </th>

              {user && hasPermission(user, [PERMISSIONS.ROLE_UPDATE]) && (
                <th className="p-3 text-center">Actions</th>
              )}
            </tr>
          </thead>

          <tbody>
            {roles.map((r) => (
              <tr key={r._id} className="border-t">
                <td className="p-3 font-medium">{r.name}</td>

                <td className="p-3">
                  <div className="flex flex-wrap gap-1">
                    {r.permissions?.map((p) => (
                      <span
                        key={p._id}
                        className="px-2 py-1 bg-gray-200 text-xs rounded"
                      >
                        {p.name}
                      </span>
                    ))}
                  </div>
                </td>

                <td className="p-3">
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      r.isActive
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {r.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                {user && hasPermission(user, [PERMISSIONS.ROLE_UPDATE]) && (
                  <>
                    <td className="p-3 text-center flex gap-2 justify-center">
                      <button
                        onClick={() => toggleStatus(r._id, r.isActive)}
                        className="px-3 py-1 text-xs bg-yellow-400 rounded"
                      >
                        {r.isActive ? "Deactivate" : "Activate"}
                      </button>

                      <button
                        onClick={() => {
                          setEditRole(r);
                          setRoleName(r.name);
                          // setSelectedPermissions(r.permissions || []);
                          setSelectedPermissions(
                            (r.permissions || []).map((p) =>
                              typeof p === "string" ? p : p._id,
                            ),
                          );
                          setShowModal(true);
                        }}
                        className="px-3 py-1 text-xs bg-blue-500 text-white rounded"
                      >
                        Edit
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {roles.length === 0 && (
          <div className="p-6 text-center text-gray-400">No roles found</div>
        )}
        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-80">
            <h3 className="mb-2">{editRole ? "Edit Role" : "Create Role"}</h3>

            <input
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className="border w-full p-2 mb-3"
              placeholder="Role name"
            />

            <div className="max-h-60 overflow-y-auto border p-3 rounded space-y-3">
              {Object.keys(groupedPermissions).map((module) => (
                <div key={module} className="border-b pb-2">
                  <label className="flex items-center gap-2 font-semibold capitalize">
                    <input
                      type="checkbox"
                      checked={isAllSelected(module)}
                      onChange={() => toggleModule(module)}
                    />
                    {module}
                  </label>

                  <div className="ml-5 mt-2 space-y-1">
                    {groupedPermissions[module].map((perm) => {
                      const action = perm.name.split(":")[1];

                      return (
                        <label
                          key={perm._id}
                          className="flex items-center gap-2 text-sm capitalize"
                        >
                          <input
                            type="checkbox"
                            checked={selectedPermissions.includes(perm._id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedPermissions((prev) =>
                                  prev.includes(perm._id)
                                    ? prev
                                    : [...prev, perm._id],
                                );
                              } else {
                                setSelectedPermissions((prev) =>
                                  prev.filter((id) => id !== perm._id),
                                );
                              }
                            }}
                          />
                          {action}
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-3">
              <button
                onClick={saveRole}
                className="bg-blue-500 text-white px-3 py-1"
              >
                Save
              </button>

              <button
                onClick={() => {
                  setShowModal(false);
                  setEditRole(null);
                  setRoleName("");
                  setSelectedPermissions([]);
                }}
                className="bg-gray-400 px-3 py-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmRole && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow w-80 text-center">
            <p className="mb-4">
              Are you sure you want to{" "}
              <b>{confirmRole.currentStatus ? "Deactivate" : "Activate"}</b>{" "}
              this role?
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setConfirmRole(null)}
                className="px-3 py-1 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  try {
                    await Api.patch(`/roles/status/${confirmRole.id}`);
                    toast.success("Role updated");
                    setConfirmRole(null);
                    fetchRoles();
                  } catch {
                    toast.error("Failed");
                  }
                }}
                className="px-3 py-1 bg-yellow-500 rounded"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RolesPage;
