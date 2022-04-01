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
import { useQnaireContext } from "./QnaireContextProvider";

export function MultipleChoiceQuestionOptions({ data, isSelected }) {
  const { updateQuestion } = useQnaireContext();
  const totalChoices = Object.keys(data.choices).length;

  return (
    <Grid container spacing={isSelected ? 1 : 0}>
      {Object.keys(data.choices).map((id) => (
        <Grid item xs={12} key={id}>
          <Choice {...data.choices[id]} data={data} editable={isSelected} />
        </Grid>
      ))}
      {isSelected ? (
        <Grid item xs={12}>
          <Grid container alignItems="flex-end">
            <Grid item xs="auto">
              <ChoiceIcon checkbox={data.max_answers > 1} />
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
                    updateQuestion(data.id, { other_choice: e.target.checked })
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
                  updateQuestion(data.id, {
                    min_answers: min,
                    max_answers: max,
                  });
                }}
                marks={[...Array(totalChoices + 1).keys()].map((i) => {
                  return { value: i, label: i.toString() };
                })}
                valueLabelDisplay="auto"
              />
            </Grid>
          </Grid>
        </Grid>
      ) : null}
    </Grid>
  );
}
