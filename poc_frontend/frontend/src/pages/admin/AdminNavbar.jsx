import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import { PERMISSIONS } from "../../constants/permissions";
import {
  hasAnyPermission,
  hasPermission,
  hasRole,
} from "../../utils/authorize";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const handleLogout = async () => {
    await api.post("/auth/logout");
    setUser(null);
    navigate("/login");
  };

  const linkClass =
    "px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200";
  const activeClass = "bg-blue-500 text-white";

  return (
    <>
      {hasAnyPermission(user) && (
        <div className="bg-white shadow-md px-6 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600">Dashboard</h1>

          <div className="flex items-center gap-4">
            {user && !hasRole(user, "admin") && (
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `${linkClass} ${isActive ? activeClass : ""}`
                }
              >
                Profile
              </NavLink>
            )}

            {user && hasPermission(user, [PERMISSIONS.USER_READ]) && (
              <NavLink
                to="/users"
                className={({ isActive }) =>
                  `${linkClass} ${isActive ? activeClass : ""}`
                }
              >
                Users
              </NavLink>
            )}

            {user && hasPermission(user, [PERMISSIONS.ROLE_READ]) && (
              <NavLink
                to="/roles"
                className={({ isActive }) =>
                  `${linkClass} ${isActive ? activeClass : ""}`
                }
              >
                Roles
              </NavLink>
            )}

            {user && hasPermission(user, [PERMISSIONS.PERMISSIONS_READ]) && (
              <NavLink
                to="/permissions"
                className={({ isActive }) =>
                  `${linkClass} ${isActive ? activeClass : ""}`
                }
              >
                Permissions
              </NavLink>
            )}
          </div>

          <div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminNavbar;
