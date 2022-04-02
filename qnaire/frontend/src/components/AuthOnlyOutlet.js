import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

export function AuthOnlyOutlet({ auth }) {
  //Outlet contains all the child routes. Render them only if authenticated.
  console.log("outlet");
  console.log(document.cookie);
  return auth.isAuthenticated ? <Outlet /> : <Navigate to="/login/" />;
}
