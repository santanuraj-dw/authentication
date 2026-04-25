import { Navigate, useLocation } from "react-router-dom";
import { hasAnyPermission, hasPermission } from "../utils/authorize";
import { useAuth } from "../context/AuthContext";

const PermissionRoute = ({ children, permissions="" }) => {
  const { user } = useAuth();
  const location = useLocation();

  console.log(user)
  if (!user) return <Navigate to="/login" />;

  if (!hasAnyPermission(user)) {
    if (location.pathname === "/") {
      return children;
    }
    return <Navigate to="/" />;
  }

  if (!hasPermission(user, permissions)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PermissionRoute;