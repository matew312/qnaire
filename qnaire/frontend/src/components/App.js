import * as React from "react";
import { render } from "react-dom";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { Grid, Box, Container } from "@mui/material";

import { QnairesPage } from "./pages/QnairesPage";
import { ResponsePage } from "./pages/ResponsePage";
import { CreationPage } from "./pages/CreationPage";
import { LoginPage } from "./pages/LoginPage";

function App() {
  return (
    <Container
      sx={{
        maxWidthXs: "100%",
        maxWidthSm: "575px",
        maxWidthMd: "750px",
        maxWidthLg: "1000px",
        maxWidthXl: "1350px",
      }}
    >
      <Grid container>
        <Grid item xs={12}>
          nav
        </Grid>
        <Grid item xs={12}>
          <BrowserRouter>
            <Routes>
              <Route path="login" element={<LoginPage />} />
              <Route path="" element={<QnairesPage />} />
              <Route path="questionnaires" element={<QnairesPage />} />
              <Route path="questionnaires/:id" element={<CreationPage />} />
              <Route
                path="questionnaires/:id/respond"
                element={<ResponsePage />}
              />
            </Routes>
          </BrowserRouter>
        </Grid>
      </Grid>
    </Container>
  );
}

render(<App />, document.getElementById("root"));
