import { Grid, TextField, Typography } from "@mui/material";
import React, { useState } from "react";

export function OpenQuestionOptions({
  id,
  min_length,
  max_length,
  isSelected,
  update,
}) {
  return isSelected ? (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TextField
          value={min_length !== null ? min_length : ""}
          onChange={(e) =>
            update({
              min_length: e.target.value ? parseInt(e.target.value) : null,
            })
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
          value={max_length !== null ? max_length : ""}
          onChange={(e) =>
            update({
              max_length: e.target.value ? parseInt(e.target.value) : null,
            })
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
