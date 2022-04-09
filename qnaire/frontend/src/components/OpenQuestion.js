import { Grid, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useOpenQuestionController } from "../controllers/useOpenQuestionController";
import { OptionMenu } from "./basic/OptionMenu";
import Question from "./Question";

export function Options({ min_length, max_length, isSelected, update }) {
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

export function Menu(props) {
  return <OptionMenu></OptionMenu>;
}

function OpenQuestion({ id, index }) {
  const questionController = useOpenQuestionController(id);

  return (
    <Question
      index={index}
      options={Options}
      menu={Menu}
      {...questionController}
    ></Question>
  );
}

export default React.memo(OpenQuestion);
