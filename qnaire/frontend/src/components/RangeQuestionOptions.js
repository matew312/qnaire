import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useState } from "react";

export const DISPLAY_TYPES = {
  1: "Výběr z možností",
  2: "Posuvník",
  3: "Vstupní pole",
  4: "Hvězdičkové hodnocení",
  5: "Smajlíkové hodnocení",
};

export function RangeQuestionOptions({
  id,
  min,
  max,
  step,
  type,
  update,
  isSelected,
}) {
  return isSelected ? (
    <Grid container spacing={2}>
      <Grid item xs={6} sm>
        <TextField
          value={min !== null ? min : ""}
          onChange={(e) =>
            update({
              min: e.target.value ? parseFloat(e.target.value) : null,
            })
          }
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
          value={max !== null ? max : ""}
          onChange={(e) =>
            update({
              max: e.target.value ? parseFloat(e.target.value) : null,
            })
          }
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
          value={step !== null ? step : ""}
          onChange={(e) =>
            update({
              step: e.target.value ? parseInt(e.target.value) : null,
            })
          }
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
            onChange={(e) => update({ type: e.target.value })}
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
