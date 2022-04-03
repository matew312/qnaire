import { Grid, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useQnaireContext } from "./QnaireContextProvider";
import { useQnaireSource } from "./QnaireSourceProvider";

export function OpenQuestionOptions({ id, isSelected }) {
  const source = useQnaireSource();
  const { min_length, max_length } = source.getQuestion(id);

  return isSelected ? (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TextField
          value={min_length !== null ? min_length : ""}
          onChange={(e) =>
            source.updateQuestion(id, {
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
            source.updateQuestion(id, {
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
