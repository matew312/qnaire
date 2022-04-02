import React, { useReducer, useContext, useRef, useEffect } from "react";
import { reducer, ActionTypes } from "../reducers";
import { GET, PATCH, POST, DELETE } from "../request";
import { ComponentId } from "../ComponentId";
import { Resources } from "../Resources";

const UPDATE_TIMEOUT = 750;

// function delayStoreTimerId(t, timerRef) {
//   return new Promise(function (resolve) {
//     timerRef.current = setTimeout(() => resolve(), t);
//   });
// }

const QnaireContext = React.createContext();
const initialState = {};

export function QnaireContextProvider({ id, children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const updateTimeout = useRef(null);

  useEffect(() => {
    GET(`${Resources.QNAIRES}/${id}`).then((data) => {
      setData(data);
    });
  }, []);

  const {
    [Resources.QNAIRES]: qnaire,
    [Resources.OTHER]: other,
    [Resources.SECTIONS]: sectionsState,
    [Resources.QUESTIONS]: questionsState,
    [Resources.CHOICES]: choicesState,
  } = state || {};
  const { sections } = sectionsState || {};
  const { questions } = questionsState || {}; //the questions state can contain other stuff like "copiedQuestion"
  const { choices } = choicesState || {};

  function setData(data) {
    dispatch({ type: ActionTypes.SET, data });
  }

  function select(component, id) {
    updateTimeout.current = null; //prevent cancel of the update to the previous selected component

    dispatch({
      type: ActionTypes.UPDATE,
      resource: Resources.OTHER,
      data: { selected: new ComponentId(component, id) },
    });
  }

  function update(resource, id, updatedData) {
    if (updateTimeout.current) {
      clearTimeout(updateTimeout.current);
    }

    dispatch({
      type: ActionTypes.UPDATE,
      resource,
      id,
      data: updatedData,
    });

    updateTimeout.current = setTimeout(
      () =>
        PATCH(`${resource}/${id}`, updatedData)
          .then(() =>
            dispatch({
              type: ActionTypes.UPDATE,
              resource,
              id,
              data: { error: "" },
            })
          )
          .catch((data) => {
            dispatch({
              type: ActionTypes.UPDATE,
              resource,
              id,
              data: { error: JSON.stringify(data) }, //just stringify the response body for now
            });
          }),
      UPDATE_TIMEOUT
    );
  }

  function updateQnaire(id, updatedData) {
    update(Resources.QNAIRES, id, updatedData);
  }

  function updateSection(id, updatedData) {
    update(Resources.SECTIONS, id, updatedData);
  }

  function updateQuestion(id, updatedData) {
    updatedData.resourcetype = questions[id].resourcetype;
    update(Resources.QUESTIONS, id, updatedData);
  }

  function updateChoice(id, updatedData) {
    update(Resources.CHOICES, id, updatedData);
  }

  function paste(type, id) {}

  //no need to useMemo here, because there is no parent component to QnaireContextProvider which could rerender it.
  const value = {
    ...qnaire,
    ...other,
    questions,
    sections,
    choices,
    select,
    setData,
    updateQnaire,
    updateSection,
    updateQuestion,
    updateChoice,
  };

  return (
    <QnaireContext.Provider value={value}>{children}</QnaireContext.Provider>
  );
}

export function useQnaireContext() {
  const context = useContext(QnaireContext);
  if (context === undefined) {
    throw new Error(
      "useQnaireContext must be used inside QnaireContextProvider"
    );
  }
  return context;
}
