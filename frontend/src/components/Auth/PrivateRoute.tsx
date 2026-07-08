
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { toast } from "sonner";

interface Props {
  children: ReactNode;
  allowedRoles?: string[];
}

const PrivateRoute = ({ children, allowedRoles }: Props) => {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  if (!token) {
    return <Navigate to="/" />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    toast.error(`Access denied: Your role (${user.role}) is not authorized for this section.`);
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;