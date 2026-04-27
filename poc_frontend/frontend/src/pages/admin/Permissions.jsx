import React, { useEffect, useState } from "react";
import api from "../../services/api";

const PermissionPage = () => {
  const [permissions, setPermissions] = useState([]);
  //   const [groupedPermissions, setGroupedPermissions] = useState({});
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedId, setSelectedId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [editPermission, setEditPermission] = useState(null);
  const [editName, setEditName] = useState("");

  const fetchPermissions = async () => {
    try {
      const res = await api.get("/permissions", {
        params: { search, sortBy, order, page, limit: 10 },
      });

      const apiData = res.data.data;
      const filteredPermissions = apiData.data
        .map((group) => ({
          ...group,
          permissions: group.permissions.filter((p) => p.name !== "select:all"),
        }))
        .filter((group) => group.permissions.length > 0);
      // console.log(filteredPermissions);

      setPermissions(filteredPermissions);
      // setPermissions(apiData.data);
      setTotalPages(apiData.pagination.pages);

      //   groupPermissions(apiData.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, [search, sortBy, order, page]);

  const groupPermissions = (data) => {
    const grouped = {};

    data.forEach((perm) => {
      const [resource, action] = perm.name.split(":");

      if (!grouped[resource]) {
        grouped[resource] = {};
      }

      grouped[resource][action] = perm;
    });

    setGroupedPermissions(grouped);
  };

  const handleToggle = async () => {
    try {
      await api.patch(`/permissions/status/${selectedId}`);
      setShowModal(false);
      fetchPermissions();
    } catch (err) {
      console.error(err);
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

  const handleEdit = async () => {
    try {
      await api.put(`/permissions/${editPermission._id}`, {
        name: editName,
      });

      setEditPermission(null);
      setEditName("");
      fetchPermissions();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => {
          setPage(1);
          setSearch(e.target.value);
        }}
        className="border px-3 py-2 mb-4 rounded"
      />

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th
                className="p-3 cursor-pointer"
                onClick={() => handleSort("name")}
              >
                Resource {getArrow("name")}
              </th>
              <th className="p-3 text-left">Read</th>
              <th className="p-3 text-left">Create</th>
              <th className="p-3 text-left">Update</th>
              <th className="p-3 text-left">Delete</th>
            </tr>
          </thead>

          <tbody>
            {permissions.map((item) => {
              const resource = item._id;

              const permsObj = {};

              item.permissions.forEach((p) => {
                const action = p.name.split(":")[1];
                permsObj[action] = p;
              });

              const renderCell = (perm) => {
                if (!perm) return <span className="text-gray-300 pr-6">-</span>;

                return (
                  <div className="flex items-center gap-3 ">
                    <button
                      onClick={() => {
                        setSelectedId(perm._id);
                        setShowModal(true);
                      }}
                      className={`px-3 py-1 text-xs bg-yellow-400 rounded ${
                        perm.isActive
                          ? "bg-green-100 text-white"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {perm.isActive ? "Active" : "Inactive"}
                    </button>

                    {/* <button
                      onClick={() => {
                        setEditPermission(perm);
                        setEditName(perm.name);
                      }}
                      className="px-2 py-1 text-xs bg-blue-500 text-white rounded"
                    >
                      Edit
                    </button> */}
                  </div>
                );
              };

              return (
                <tr key={resource} className="border-t text-center">
                  <td className="p-3 font-semibold capitalize">{resource}</td>

                  <td>{renderCell(permsObj.read)}</td>
                  <td>{renderCell(permsObj.create)}</td>
                  <td>{renderCell(permsObj.update)}</td>
                  <td>{renderCell(permsObj.delete)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {permissions.length === 0 && (
          <div className="p-6 text-center text-gray-400">No roles found</div>
        )}

        <div className="p-4 border-t">
          <div className="flex justify-center items-center gap-3">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Prev
            </button>

            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow w-80 text-center">
            <p className="mb-4 text-gray-700">
              Are you sure you want to change this status?
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleToggle}
                className="px-3 py-1 bg-yellow-500 text-white rounded"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
      {editPermission && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow w-80">
            <h3 className="mb-3 font-semibold">Edit Permission</h3>

            <div className="mb-2 text-sm text-gray-500">
              Resource:{" "}
              <span className="font-medium">
                {editPermission.name.split(":")[0]}
              </span>
            </div>

            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="border w-full p-2 mb-3 rounded"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditPermission(null)}
                className="px-3 py-1 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleEdit}
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

export default PermissionPage;
