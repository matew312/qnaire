import { Grid, TextField, Typography } from "@mui/material";
import React, { useState } from "react";

export function OpenQuestionOptions({
  data,
  isSelected,
  dispatchQuestionUpdate,
}) {
  return isSelected ? (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TextField
          value={data.min_length}
          onChange={(e) =>
            dispatchQuestionUpdate({ min_length: e.target.value })
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
          value={data.max_length}
          onChange={(e) =>
            dispatchQuestionUpdate({ max_length: e.target.value })
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
