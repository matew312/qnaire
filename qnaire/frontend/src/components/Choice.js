import React, { useState } from "react";
import { Grid, IconButton } from "@mui/material";
import { EditableText } from "./basic/EditableText";
import { ChoiceIcon } from "./basic/ChoiceIcon";
import ClearIcon from "@mui/icons-material/Clear";

export function Choice(props) {
  return (
    <Grid container alignItems="center">
      <Grid item xs="auto">
        <ChoiceIcon checkbox={props.checkbox} />
      </Grid>
      <Grid item xs>
        <EditableText
          value={props.value}
          editable={props.editable}
          onChange={props.onChange}
          textFieldProps={props.textFieldProps}
        />
      </Grid>
      {props.editable && (
        <Grid item xs="auto">
          <IconButton>
            <ClearIcon />
          </IconButton>
        </Grid>
      )}
    </Grid>
  );
}

Choice.defaultProps = {
  value: "",
  editable: true,
  checkbox: false,
  textFieldProps: { variant: "standard", fullWidth: true , required: true},
};
