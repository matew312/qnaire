import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Slider from "@mui/material/Slider";
import Input from "@mui/material/Input";

export function InputSlider(props) {
  const defaultValue = props.min; //TODO: calculate middle between min and max (but it must be a multiple of step)
  const [value, setValue] = useState(defaultValue);

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleInputChange = (event) => {
    //the value is allowed to be an empty string, so this needs to be kept in mind
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
    <Grid container spacing={2} alignItems="center">
      <Grid item xs>
        <Slider
          value={typeof value === "number" ? value : props.min}
          onChange={handleSliderChange}
          step={props.step}
          marks
          min={props.min}
          max={props.max}
          aria-labelledby="input-slider"
        />
      </Grid>
      <Grid item>
        <Input
          value={value}
          size="small"
          onChange={handleInputChange}
          onBlur={handleBlur}
          inputProps={{
            step: props.step,
            min: props.min,
            max: props.max,
            type: "number",
            "aria-labelledby": "input-slider",
          }}
        />
      </Grid>
    </Grid>
  );
}

InputSlider.defaultProps = {
  min: 0,
  max: 100,
  step: 10
}
