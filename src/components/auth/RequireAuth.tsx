import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import { getAccessToken } from "../../auth/token";

interface Props {
  children: ReactNode;
}

export default function RequireAuth({ children }: Props) {
  const location = useLocation();
  const token = getAccessToken();
  if (!token) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }
  return <>{children}</>;
}