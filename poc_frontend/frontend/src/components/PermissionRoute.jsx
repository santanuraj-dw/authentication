import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { hasPermission } from "../utils/authorize";

const PermissionRoute = ({ children, permissions }) => {
  const { user } = useAuth();
  console.log(user);
  if (!user) return <Navigate to="/login" />;

  if (!hasPermission(user, permissions)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PermissionRoute;
