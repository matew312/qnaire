import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { useQnaireContext } from "./QnaireContextProvider";
import { useQnaireSource } from "./QnaireSourceProvider";

export const DISPLAY_TYPES = {
  1: "Výběr z možností",
  2: "Posuvník",
  3: "Vstupní pole",
  4: "Hvězdičkové hodnocení",
  5: "Smajlíkové hodnocení",
};

export function RangeQuestionOptions({ id, isSelected }) {
  const source = useQnaireSource();
  const { min, max, step, type } = source.getQuestion(id);

  return isSelected ? (
    <Grid container spacing={2}>
      <Grid item xs={6} sm>
        <TextField
          value={min !== null ? min : ""}
          onChange={(e) =>
            source.updateQuestion(id, {
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
            source.updateQuestion(id, {
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
          value={step ? step : ""}
          onChange={(e) =>
            source.updateQuestion(id, {
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
            onChange={(e) =>
              source.updateQuestion(id, { type: e.target.value })
            }
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
