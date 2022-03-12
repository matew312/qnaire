import React, { useState } from "react";
import { TextField } from "@mui/material";

export function NumField(props) {
  const defaultValue = props.min;
  const [value, setValue] = useState(defaultValue);

  const handleInputChange = (event) => {
    setValue(event.target.value === "" ? "" : Number(event.target.value));
  };

  const handleBlur = () => {
    if (value < props.min) {
      setValue(props.min);
    } else if (value > props.max) {
      setValue(props.max);
    }
  };

  return (
    <TextField
      value={value}
      size={props.size}
      inputProps={{
        step: props.step,
        min: props.min,
        max: props.max,
        type: "number",
        "aria-labelledby": "input-slider",
      }}
      onChange={handleInputChange}
      onBlur={handleBlur}
    />
  );
}

NumField.defaultProps = {
  size: "medium",
  step: 1,
  min: 0,
  max: 100,
};
