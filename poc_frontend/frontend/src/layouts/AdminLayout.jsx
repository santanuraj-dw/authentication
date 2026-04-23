import React from "react";
import AdminNavbar from "../pages/admin/AdminNavbar";


const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />
      <div className="p-6">{children}</div>
    </div>
  );
};

export default AdminLayout;