import * as React from "react";
import { Typography } from "@mui/material";

export default function ErrorList({ error }) {
  return error ? (
    <React.Fragment>
      {error.non_field_errors && (
        <Typography color="error" textAlign="center">
          {error.non_field_errors}
        </Typography>
      )}
      {error.detail && (
        <Typography color="error" textAlign="center">
          {error.detail}
        </Typography>
      )}
    </React.Fragment>
  ) : null;
}
