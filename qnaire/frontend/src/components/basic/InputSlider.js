import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Slider from "@mui/material/Slider";
import Input from "@mui/material/Input";
import { ensurePrecision } from "../../utils";

export function InputSlider({ min, max, ...props }) {
  const isStep = Boolean(props.step);
  // make slider use 2 decimal places when step isn't defined (but the step isn't enforced in the Input)
  const step = isStep ? props.step : 0.01;
  const midValue = isStep
    ? ensurePrecision(min + Math.round((max - min) / step / 2) * step, step)
    : min + (max - min) / 2;
  const defaultValue = props.defaultValue ? props.defaultValue : midValue;
  const [value, setValue] = useState(defaultValue);

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleInputChange = (event) => {
    //the value is allowed to be an empty string, so this needs to be kept in mind
    setValue(event.target.value === "" ? "" : Number(event.target.value));
  };

  const handleBlur = () => {
    if (value < min) {
      setValue(min);
    } else if (value > max) {
      setValue(max);
    } else {
      if (isStep) {
        //allow only multiples of step
        setValue(ensurePrecision(value, step));
      }
    }
  };

  const marks = [
    {
      value: min,
      label: min.toString(),
    },
  ];
  if (isStep) {
    let mark_value = min;
    while (mark_value < max) {
      marks.push({
        value: mark_value,
      });
      mark_value += step;
    }
  }
  marks.push({
    value: max,
    label: max.toString(),
  });

  return (
    <Grid container spacing={4} alignItems="center">
      <Grid item xs>
        <Slider
          value={typeof value === "number" ? value : min}
          onChange={handleSliderChange}
          step={step}
          marks={marks}
          min={min}
          max={max}
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
            step: step,
            min: min,
            max: max,
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
  step: 10,
};
