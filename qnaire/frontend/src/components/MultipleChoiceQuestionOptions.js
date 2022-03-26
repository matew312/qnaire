import {
  Button,
  FormControlLabel,
  FormGroup,
  Grid,
  Slider,
  Switch,
  Typography,
  Box,
} from "@mui/material";
import React, { useState } from "react";
import { ChoiceIcon } from "./basic/ChoiceIcon";
import { Choice } from "./Choice";
import { ActionTypes } from "../reducers";

export function MultipleChoiceQuestionOptions({
  data,
  isSelected,
  dispatch,
  dispatchQuestionUpdate,
}) {
  const checkbox = data.max_answers > 1;
  const totalChoices = Object.keys(data.choices).length;

  return (
    <div>
      {Object.keys(data.choices).map((id) => (
        <Choice
          key={id}
          value={data.choices[id].text}
          checkbox={checkbox}
          editable={isSelected}
          onChange={(text) =>
            dispatch({
              type: ActionTypes.UPDATE_QUESTION_CHOICE,
              id: data.id,
              choiceId: id,
              data: { text },
            })
          }
        />
      ))}
      {isSelected ? (
        <div>
          <Grid container alignItems="flex-end">
            <Grid item xs="auto">
              <ChoiceIcon checkbox={checkbox} />
            </Grid>
            <Grid item xs>
              <Button variant="text">Přidat možnost</Button>
            </Grid>
          </Grid>
          <FormGroup mt={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={data.other_choice}
                  onChange={(e) =>
                    dispatchQuestionUpdate({ other_choice: e.target.checked })
                  }
                />
              }
              label="Jiná odpověď"
            />
          </FormGroup>
          <Grid container alignItems="top">
            <Grid item xs="auto" m="auto">
              <Typography>Povolený počet vybraných možností</Typography>
            </Grid>
            <Box width="100%" />
            <Grid item xs={12} sm={6} px={2} m="auto">
              <Slider
                value={[
                  data.min_answers,
                  data.max_answers ? data.max_answers : totalChoices,
                ]}
                min={0}
                max={totalChoices}
                step={1}
                onChange={(e) => {
                  const [min, max] = e.target.value;
                  dispatchQuestionUpdate({
                    min_answers: min,
                    max_answers: max,
                  });
                }}
                marks={[
                  {
                    value: 0,
                    label: "0",
                  },
                  { value: totalChoices, label: totalChoices.toString() },
                ]}
                valueLabelDisplay="auto"
              />
            </Grid>
          </Grid>
        </div>
      ) : null}
    </div>
  );
}
