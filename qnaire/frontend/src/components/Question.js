import {
  Grid,
  Select,
  MenuItem,
  Switch,
  FormGroup,
  FormControlLabel,
  FormControl,
  InputLabel,
  Divider,
  Box,
  IconButton,
  Tooltip,
  Typography,
  Card,
  CardContent,
  CardActionArea,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { OpenQuestionOptions } from "./OpenQuestionOptions";
import { RangeQuestionOptions } from "./RangeQuestionOptions";
import { MultipleChoiceQuestionOptions } from "./MultipleChoiceQuestionOptions";
import { EditableText } from "./basic/EditableText";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  OpenQuestionMenu,
  RangeQuestionMenu,
  MultipleChoiceQuestionMenu,
} from "./QuestionMenu";
import { useQuestionController } from "../controllers/useQuestionController";
import { useQuestionSelect } from "../providers/QnaireProvider";
import { getSelectedStyle } from "../style";

const QUESTION_TYPES = {
  OpenQuestion: {
    component: OpenQuestionOptions,
    desc: "Otevřená otázka",
    menu: OpenQuestionMenu,
  },
  RangeQuestion: {
    component: RangeQuestionOptions,
    desc: "Výběr čísla z rozmezí",
    menu: RangeQuestionMenu,
  },
  MultipleChoiceQuestion: {
    component: MultipleChoiceQuestionOptions,
    desc: "Výběr z možností",
    menu: MultipleChoiceQuestionMenu,
  },
};

function Question({ id }) {
  const { text, mandatory, order_num, resourcetype, error, update, ...data } =
    useQuestionController(id);

  const { isSelected, select } = useQuestionSelect(id);

  const QuestionOptions = QUESTION_TYPES[resourcetype].component;
  const QuestionMenu = QUESTION_TYPES[resourcetype].menu;

  return (
    <Card
      sx={getSelectedStyle(isSelected)}
      className="clickable"
      onClick={select}
    >
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={8}>
            <EditableText
              onChange={(text) => update({ text })}
              editable={isSelected}
              value={text}
              typographyProps={{ variant: "h4" }}
              textFieldProps={{
                fullWidth: true,
                id: "question-text",
                label: "Otázka",
                required: true,
              }}
            />
          </Grid>
          {isSelected && (
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel id="type-select-label">Typ otázky</InputLabel>
                <Select
                  value={resourcetype}
                  label="Typ otázky"
                  onChange={(e) => update({ resourcetype: e.target.value })}
                  id="type-select"
                  labelId="type-select-label"
                  required
                >
                  {Object.keys(QUESTION_TYPES).map((type) => (
                    <MenuItem value={type} key={type}>
                      {QUESTION_TYPES[type].desc}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}

          <Grid item xs={12}>
            <QuestionOptions
              id={id}
              {...data}
              update={update}
              isSelected={isSelected}
            />
          </Grid>

          {isSelected && (
            <Grid item container xs={12}>
              <Grid item xs={12}>
                <Divider light />
              </Grid>
              <Grid
                item
                container
                xs={12}
                justifyContent="flex-end"
                sx={{ pt: 1 }}
              >
                <Grid item xs="auto">
                  <Tooltip title="Zkopírovat">
                    <IconButton>
                      <ContentCopyIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>
                {/* <Grid item xs="auto">
                  <Tooltip title="Vyjmout">
                    <IconButton>
                      <ContentCutIcon />
                    </IconButton>
                  </Tooltip>
                </Grid> */}
                <Grid item xs="auto">
                  <Tooltip title="Smazat">
                    <IconButton>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>

                <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
                <Grid item xs="auto">
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={mandatory}
                          onChange={(e) =>
                            update({
                              mandatory: e.target.checked,
                            })
                          }
                        />
                      }
                      label="Povinná"
                    />
                  </FormGroup>
                </Grid>
                <Grid item xs="auto">
                  <QuestionMenu id={id} {...data} update={update} />
                </Grid>
              </Grid>
            </Grid>
          )}

          {error && (
            <Grid item xs={12}>
              <Typography color="error" textAlign="center">
                {error}
              </Typography>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
}

Question.defaultProps = {
  type: "MultipleChoiceQuestion",
};

export default React.memo(Question);
