import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import QnairesPage from "./QnairesPage";
import ResponsePage from "./ResponsePage";
import CreationPage from "./CreationPage";

export default class Nav extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    //later on "/" will prolly lead to login
    return (
      <Router>
        <Routes>
          <Route path="/" element={<QnairesPage />} />
          <Route path="questionnaires" element={<QnairesPage />} />
          <Route path="questionnaires/:id" element={<CreationPage />} />
          <Route path="questionnaires/:id/respond" element={<ResponsePage />} />
        </Routes>
      </Router>
    );
  }
}
