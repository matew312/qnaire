import { Grid, TextField, Typography } from "@mui/material";
import React, { useState } from "react";

export function OpenQuestionOptions({
  data,
  isSelected,
  updateQuestion,
}) {
  const { min_length, max_length } = data;

  return isSelected ? (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TextField
          value={min_length ? min_length : ""}
          onChange={(e) =>
            updateQuestion({ min_length: parseInt(e.target.value) })
          }
          fullWidth
          id="min-length"
          label="Minimální počet znaků odpovědi"
          type="number"
          variant="standard"
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          value={max_length ? max_length : ""}
          onChange={(e) =>
            updateQuestion({ max_length: parseInt(e.target.value) })
          }
          fullWidth
          id="max-length"
          label="Maximální počet znaků odpovědi"
          type="number"
          variant="standard"
        />
      </Grid>
    </Grid>
  ) : null;
}
