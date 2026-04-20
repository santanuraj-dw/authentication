import { createContext, useContext, useEffect, useState } from "react";
import Api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // const [loading, setLoading] = useState(true);

 useEffect(() => {
  console.log("Calling /auth/me...");

  Api.get("/auth/me")
    .then((res) => {
      console.log("User fetched:", res);
      setUser(res.data.data);
    })
    .catch((err) => {
      console.log("Auth error:", err?.response);
      setUser(null);
    })
}, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
