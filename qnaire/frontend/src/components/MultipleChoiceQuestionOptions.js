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
import React, { useMemo, useState } from "react";
import { ChoiceIcon } from "./basic/ChoiceIcon";
import Choice from "./Choice";
import { useMultipleChoiceQuestionController } from "../controllers/useMultipleChoiceQuestionController";

export function MultipleChoiceQuestionOptions({
  id,
  min_answers,
  max_answers,
  other_choice,
  isSelected,
  update,
}) {
  const { choiceIds } = useMultipleChoiceQuestionController(id);

  const totalChoices = choiceIds.length;
  const checkbox = max_answers > 1;

  return (
    <Grid container spacing={isSelected ? 1 : 0}>
      {choiceIds.map((choiceId) => (
        <Grid item xs={12} key={choiceId}>
          <Choice id={choiceId} editable={isSelected} checkbox={checkbox} />
        </Grid>
      ))}
      {isSelected ? (
        <Grid item xs={12}>
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
                  checked={other_choice}
                  onChange={(e) =>
                    update({
                      other_choice: e.target.checked,
                    })
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
                  min_answers,
                  max_answers !== null ? max_answers : totalChoices,
                ]}
                min={0}
                max={totalChoices}
                step={1}
                onChange={(e) => {
                  const [min, max] = e.target.value;
                  update({
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
