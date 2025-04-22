import { useUser } from "@clerk/clerk-react";
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ requiredRole, children }) => {
  const { isSignedIn, user } = useUser();

  if (!isSignedIn) {
    // Chưa đăng nhập, chuyển hướng đến trang đăng nhập
    return <Navigate to="/login" />;
  }

  const userRole = {
    isSeller: user?.publicMetadata?.isSeller || false,
    isAdmin: user?.publicMetadata?.isAdmin || false,
  };

  // Kiểm tra vai trò cần thiết
  if (requiredRole === "admin" && !userRole.isAdmin) {
    return <Navigate to="/" />;
  }
  if (requiredRole === "seller" && !userRole.isSeller) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;