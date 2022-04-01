import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useState } from "react";

const DISPLAY_TYPES = {
  1: "Výběr z možností",
  2: "Posuvník",
  3: "Vstupní pole",
  4: "Hvězdičkové hodnocení",
  5: "Smajlíkové hodnocení",
};

export function RangeQuestionOptions({
  data: { min, max, step, type },
  isSelected,
  dispatchQuestionUpdate,
}) {
  return isSelected ? (
    <Grid container spacing={2}>
      <Grid item xs={6} sm>
        <TextField
          value={min}
          onChange={(e) => dispatchQuestionUpdate({ min: parseInt(e.target.value) })}
          required
          label="Min"
          id="range-min"
          type="number"
          variant="standard"
          fullWidth
        />
      </Grid>
      <Grid item xs={6} sm>
        <TextField
          value={max}
          onChange={(e) => dispatchQuestionUpdate({ max: parseInt(e.target.value) })}
          required
          label="Max"
          id="range-max"
          type="number"
          variant="standard"
          fullWidth
        />
      </Grid>
      <Grid item xs={6} sm>
        <TextField
          value={step ? step : ""}
          onChange={(e) => dispatchQuestionUpdate({ step: parseInt(e.target.value) })}
          label="Skok"
          id="range-step"
          type="number"
          variant="standard"
          fullWidth
        />
      </Grid>
      <Grid item xs={6} sm={4}>
        <FormControl fullWidth>
          <InputLabel id="range-type-select-label">Způsob zobrazení</InputLabel>
          <Select
            value={type}
            onChange={(e) => dispatchQuestionUpdate({ type: e.target.value })}
            label="Způsob zobrazení"
            id="range-type-select"
            labelId="range-type-select-label"
            required
            autoWidth
          >
            {Object.keys(DISPLAY_TYPES).map((type) => (
              <MenuItem value={type} key={type}>
                {DISPLAY_TYPES[type]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  ) : null;
}
