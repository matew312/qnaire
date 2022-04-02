import React, { useState } from "react";
import { render } from "react-dom";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { Grid, Box, Container } from "@mui/material";

import { QnairesPage } from "./pages/QnairesPage";
import { ResponsePage } from "./pages/ResponsePage";
import { CreationPage } from "./pages/CreationPage";
import { LoginPage } from "./pages/LoginPage";
import { AppStructure } from "./AppStructure";
import { useAuth } from "../auth";
import { AuthOnlyOutlet } from "./AuthOnlyOutlet";
import { AppContextProvider } from "./AppContextProvider";
import Cookies from "universal-cookie";

function App() {
  const auth = useAuth();

  console.log(auth.isAuthenticated);

  return (
    <div>
      <BrowserRouter>
        <AppContextProvider>
          <AppStructure auth={auth}>
            {/* <Container> */}
            <Grid container mt={2}>
              <Grid item xs={12} md={10} lg={8} m="auto">
                <Routes>
                  <Route path="login" element={<LoginPage auth={auth} />} />
                  <Route
                    path="questionnaires/:id/respond"
                    element={<ResponsePage />}
                  />
                  <Route
                    path="questionnaires/:id/respond/:privateId"
                    element={<ResponsePage />}
                  />
                  <Route path="/" element={<AuthOnlyOutlet auth={auth} />}>
                    <Route path="" element={<QnairesPage />} />
                    <Route path="questionnaires" element={<QnairesPage />} />
                    <Route
                      path="questionnaires/:id"
                      element={<CreationPage />}
                    />
                  </Route>
                </Routes>
              </Grid>
            </Grid>
            {/* </Container> */}
          </AppStructure>
        </AppContextProvider>
      </BrowserRouter>
    </div>
  );
}

render(<App />, document.getElementById("root"));
