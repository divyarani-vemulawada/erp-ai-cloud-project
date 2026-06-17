
import {
  Navigate
} from "react-router-dom";
import type{ ReactNode } from "react";

interface Props {
  children: ReactNode;
  role: string;
}

const RoleRoute = ({
  children,
  role
}: Props) => {
  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  if (user.role !== role) {
    return (
      <Navigate
        to="/unauthorized"
      />
    );
  }

  return children;
};

export default RoleRoute;