import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  // console.log("hello",user)

  if (!user) return <Navigate to="/login" />;

  if (user.roles[0].name !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminRoute;