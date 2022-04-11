import { FormControlLabel, Switch } from "@mui/material";
import * as React from "react";

export default function FSwitch({ id, label, formik }) {
  return (
    <FormControlLabel
      control={
        <Switch
          id={id}
          name={id}
          onChange={formik.handleChange}
          checked={formik.values[id]}
        />
      }
      label={label}
    />
  );
}
