import { Grid, Typography } from "@mui/material";
import React, { useEffect, useReducer, useState } from "react";
import { EditableText } from "./basic/EditableText";
import { Section } from "./Section";
import { SelectableType, Selected } from "../SelectableType";
import { dictToArraySortedByOrderNum } from "../qnaireUtils";

import { reducer, ActionTypes } from "../reducers";
import { GET } from "../network";

// export const QnaireDispatch = React.createContext(null);
// export const QnaireState = React.createContext(null);

const initialState = null;

export function Questionnaire({ id }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    GET(`questionnaires/${id}`, (data) => {
      dispatch({ type: ActionTypes.SET, data });
    });
  });

  const {
    qnaire,
    sections: sectionsState,
    questions: questionsState,
  } = state || {};
  const { selected } = qnaire || {}; //if data is null, an empty object will be used, so the destrured variables will be undefined
  const { sections } = sectionsState || {};
  const { questions } = questionsState || {}; //the questions state can contain other stuff like "copiedQuestion"

  function findQuestionsForSection(id) {
    const qs = questions;
    return Object.keys(qs).reduce((filtered, qId) => {
      if (qs[qId].section === id) {
        filtered.push(qs[qId]);
      }
      return filtered;
    }, []);
  }

  return state ? (
    <Grid container spacing={4}>
      <Grid
        item
        container
        xs={12}
        onClick={() =>
          dispatch({
            type: ActionTypes.SELECT,
            data: { type: SelectableType.QUESTIONNAIRE, id: qnaire.id },
          })
        }
      >
        <Grid item xs>
          <EditableText
            editable={selected && selected.type == SelectableType.QUESTIONNAIRE}
            typographyProps={{ variant: "h2" }}
            value={qnaire.name}
            textFieldProps={{
              fullWidth: true,
              label: "Dotazník",
              id: "questionnaire-name",
              required: true,
            }}
          />
        </Grid>
      </Grid>
      <Grid item container xs={12} spacing={4}>
        {dictToArraySortedByOrderNum(sections).map((section) => (
          <Grid item xs={12} key={section.id}>
            <Section
              data={section}
              questions={findQuestionsForSection(section.id)}
              dispatch={dispatch}
              selected={selected}
            />
          </Grid>
        ))}
      </Grid>
    </Grid>
  ) : null;
}
