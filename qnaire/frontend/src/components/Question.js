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
} from "@mui/material";
import React, { useContext, useRef, useState } from "react";
import { OpenQuestionOptions } from "./OpenQuestionOptions";
import { RangeQuestionOptions } from "./RangeQuestionOptions";
import { MultipleChoiceQuestionOptions } from "./MultipleChoiceQuestionOptions";
import { EditableText } from "./basic/EditableText";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { SelectableType } from "../ComponentId";
import {
  OpenQuestionMenu,
  RangeQuestionMenu,
  MultipleChoiceQuestionMenu,
} from "./QuestionMenu";
import { ActionTypes } from "../reducers";
import { PATCH, GET } from "../request";
import constants from "../constants";
import { useQnaireContext } from "./QnaireContextProvider";

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

export function Question({ data }) {
  const { id, text, mandatory, order_num, resourcetype } = data;
  const { selected, select, updateQuestion } = useQnaireContext();
  const updateTimeout = useRef(null);
  const [errorText, setErrorText] = useState("");
  const isSelected = Boolean(selected && selected.isEqual(Question, id));

  // function updateQuestion(updatedData) {
  //   dispatchQuestionUpdate(updatedData);

  //   if (updateTimeout.current) {
  //     clearTimeout(updateTimeout.current);
  //   }

  //   updateTimeout.current = setTimeout(
  //     () =>
  //       PATCH(`questions/${id}`, { resourcetype, ...updatedData })
  //         .then((data) => setErrorText(""))
  //         .catch(
  //           (err) => setErrorText(err.toString()) //show the error (most errors should be caught before its even sent to the server)
  //         ),
  //     constants.UPDATE_TIMEOUT
  //   );
  // }

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
    <div onClick={() => select(Question, id)}>
      <Box sx={style}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={8}>
            <EditableText
              onChange={(text) => updateQuestion(id, { text })}
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
                  onChange={(e) => updateQuestionType(id, e.target.value)}
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
            <Options isSelected={isSelected} data={data} />
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
                            updateQuestion(id, {
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
          <Grid item xs={12}>
            <Typography color="error" textAlign="center">
              {errorText}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

Question.defaultProps = {
  type: "MultipleChoiceQuestion",
};
