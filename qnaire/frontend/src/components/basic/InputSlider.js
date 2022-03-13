import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Slider from "@mui/material/Slider";
import Input from "@mui/material/Input";
import { ensurePrecision } from "../../utils";

export function InputSlider(props) {
  const midValue = ensurePrecision(
    props.min +
      Math.round((props.max - props.min) / props.step / 2) * props.step,
    props.step
  );
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
    if (value < props.min) {
      setValue(props.min);
    } else if (value > props.max) {
      setValue(props.max);
    }
    else {
      //allow only multiples of step
      setValue(ensurePrecision(value, props.step))
    }
  };

  const marks = [
    {
      value: props.min,
      label: props.min.toString(),
    },
  ];
  let mark_value = props.min;
  while (mark_value < props.max) {
    marks.push({
      value: mark_value,
    });
    mark_value += props.step;
  }
  marks.push({
    value: props.max,
    label: props.max.toString(),
  });

  return (
    <Grid container spacing={4} alignItems="center">
      <Grid item xs>
        <Slider
          value={typeof value === "number" ? value : props.min}
          onChange={handleSliderChange}
          step={props.step}
          marks={marks}
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
  step: 10,
};
