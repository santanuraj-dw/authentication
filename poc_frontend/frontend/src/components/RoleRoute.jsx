import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { hasRole } from "../utils/authorize";

const RoleRoute = ({ children }) => {
  const { user } = useAuth();
  // console.log("hello",user)

  if (!user) return <Navigate to="/login" />;

  // if (user.roles[0].name !== "admin") {
  //   return <Navigate to="/" />;
  // }

  if (hasRole(user, "admin")) {
    return <Navigate to="/users" />;
  }

  return <Outlet/>;
};

export default RoleRoute;
