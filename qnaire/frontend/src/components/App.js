import * as React from "react";
import { render } from "react-dom";
import { Routes, Route, BrowserRouter } from "react-router-dom";

import { QnairesPage } from "./pages/QnairesPage";
import { ResponsePage } from "./pages/ResponsePage";
import { CreationPage } from "./pages/CreationPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="questionnaires" element={<QnairesPage />} />
        <Route path="questionnaires/:id" element={<CreationPage />} />
        <Route path="questionnaires/:id/respond" element={<ResponsePage />} />
      </Routes>
    </BrowserRouter>
  );
}

const appDiv = document.getElementById("app");
render(<App />, appDiv);
