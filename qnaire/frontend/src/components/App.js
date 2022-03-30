import React, { useState } from "react";
import { render } from "react-dom";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { Grid, Box, Container } from "@mui/material";

import { QnairesPage } from "./pages/QnairesPage";
import { ResponsePage } from "./pages/ResponsePage";
import { CreationPage } from "./pages/CreationPage";
import { LoginPage } from "./pages/LoginPage";
import { AppBar } from "./AppBar";
import { useAuth } from "../auth";
import { AuthOnlyOutlet } from "./AuthOnlyOutlet";

function App() {
  const auth = useAuth();

  return (
    <div>
      <BrowserRouter>
        <AppBar auth={auth} />
        <Container>
          <Grid container mt={4}>
            <Grid item xs={12}>
              <Routes>
                <Route path="login" element={<LoginPage auth={auth} />} />
                <Route path="/" element={<AuthOnlyOutlet auth={auth} />}>
                  <Route path="" element={<QnairesPage />} />
                  <Route path="questionnaires" element={<QnairesPage />} />
                  <Route path="questionnaires/:id" element={<CreationPage />} />
                  <Route
                    path="questionnaires/:id/respond"
                    element={<ResponsePage />}
                  />
                  <Route
                    path="questionnaires/:id/respond/:privateId"
                    element={<ResponsePage />}
                  />
                </Route>
              </Routes>
            </Grid>
          </Grid>
        </Container>
      </BrowserRouter>
    </div>
  );
}

render(<App />, document.getElementById("root"));
