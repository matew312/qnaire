import * as React from "react";
import { Typography } from "@mui/material";

export default function ErrorList({ error }) {
  return (
    <React.Fragment>
      {error.none_field_errors && (
        <Typography key={key} color="error" textAlign="center">
          {error.none_field_errors}
        </Typography>
      )}
      {error.detail && (
        <Typography key={key} color="error" textAlign="center">
          {error.detail}
        </Typography>
      )}
    </React.Fragment>
  );
}
