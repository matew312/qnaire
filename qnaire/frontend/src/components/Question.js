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
} from "@mui/material";
import React, { useContext, useState } from "react";
import { OpenQuestionOptions } from "./OpenQuestionOptions";
import { RangeQuestionOptions } from "./RangeQuestionOptions";
import { MultipleChoiceQuestionOptions } from "./MultipleChoiceQuestionOptions";
import { EditableText } from "./basic/EditableText";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { SelectableType } from "../SelectableType";
import {
  OpenQuestionMenu,
  RangeQuestionMenu,
  MultipleChoiceQuestionMenu,
} from "./QuestionMenu";
import { ActionTypes } from "../reducers";

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

export function Question({ data, selected, dispatch }) {
  const { id, text, mandatory, order_num, resourcetype } = data;
  const isSelected = Boolean(
    selected && selected.type === SelectableType.QUESTION && selected.id === id
  );

  function dispatchQuestionUpdate(updatedData) {
    dispatch({
      type: ActionTypes.UPDATE,
      resource: 'questions',
      id,
      data: updatedData,
    });
  }

  const style = {
    bgcolor: "white",
    borderRadius: 2,
    display: "flex",
    px: 2,
    py: 2,
  };
  if (isSelected) {
    Object.assign(style, {
      border: 1,
      borderColor: "primary.light",
    });
  }

  const Options = QUESTION_TYPES[resourcetype].component;
  const Menu = QUESTION_TYPES[resourcetype].menu;

  return (
    <div
      onClick={() => {
        dispatch({
          type: ActionTypes.SELECT,
          name: "questions",
          data: { type: SelectableType.QUESTION, id },
        });
      }}
    >
      <Box sx={style}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={8}>
            <EditableText
              onChange={(text) => dispatchQuestionUpdate({ text })}
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
                  onChange={(e) =>
                    dispatch({
                      type: ActionTypes.UPDATE_QUESTION_TYPE,
                      id,
                      data: {
                        resourcetype: e.target.value,
                      },
                    })
                  }
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
            <Options
              isSelected={isSelected}
              data={data}
              dispatchQuestionUpdate={dispatchQuestionUpdate} //I want to reuse this function
              dispatch={dispatch} //I also pass dispatch for the case if something has its own action.type (updating choices)
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
                            dispatchQuestionUpdate({
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
                  <Menu data={data} />
                </Grid>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Box>
    </div>
  );
}

Question.defaultProps = {
  type: "MultipleChoiceQuestion",
};
