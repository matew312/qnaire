import React, { useState } from "react";
import { Radio } from "@mui/material";
import { EditableText } from "./basic/EditableText";

export function Choice(props) {
  return (
    <div>
      <Radio checked={false} />
      <EditableText {...props} />
    </div>
  );
}

Choice.defaultProps = {
  value: "",
  isFocused: true,
};
