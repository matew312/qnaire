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
import { useQnaireContext } from "./QnaireContextProvider";

export function MultipleChoiceQuestionOptions({
  data: { id, min_answers, max_answers, other_choice },
  isSelected,
}) {
  const { choices: allChoices, updateQuestion } = useQnaireContext();
  const choices = useMemo(
    () =>
      Object.keys(allChoices).reduce((filtered, choiceId) => {
        if (allChoices[choiceId].question === id) {
          filtered.push(allChoices[choiceId]);
        }
        return filtered;
      }, []),
    [allChoices]
  );
  const totalChoices = choices.length;
  const checkbox = max_answers > 1;

  return (
    <Grid container spacing={isSelected ? 1 : 0}>
      {choices.map((choice) => (
        <Grid item xs={12} key={choice.id}>
          <Choice {...choice} editable={isSelected} checkbox={checkbox} />
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
                    updateQuestion(id, { other_choice: e.target.checked })
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
                value={[min_answers, max_answers ? max_answers : totalChoices]}
                min={0}
                max={totalChoices}
                step={1}
                onChange={(e) => {
                  const [min, max] = e.target.value;
                  updateQuestion(id, {
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
