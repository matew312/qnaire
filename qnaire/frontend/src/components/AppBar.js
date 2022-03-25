import React from "react";
import { BaseAppBar } from "./BaseAppBar";

export function AppBar({ auth }) {
  const loginOrLogoutItem = auth.isAuthenticated
    ? {
        name: "Odhlásit se",
        callback: (navigate) => {
          auth.annulAuthentication();
          navigate("/login");
        },
      }
    : {
        name: "Příhlasit se",
        path: "/login",
      };

  const pages = [{ name: "Dotazníky", path: "/questionnaires" }];
  const settings = [loginOrLogoutItem];

  return <BaseAppBar pages={pages} settings={settings} name="APP" />;
}
