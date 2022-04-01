import React, { useReducer, useContext } from "react";
import { reducer, ActionTypes } from "../reducers";
import { ComponentId } from "../ComponentId";

const QnaireContext = React.createContext();
const initialState = {};

export function QnaireContextProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const {
    qnaire,
    sections: sectionsState,
    questions: questionsState,
  } = state || {};
  const { sections } = sectionsState || {};
  const { questions } = questionsState || {}; //the questions state can contain other stuff like "copiedQuestion"

  function setData(data) {
    dispatch({ type: ActionTypes.SET, data });
  }

  function select(component, id) {
    dispatch({
      type: ActionTypes.SELECT,
      name: "qnaire",
      data: new ComponentId(component, id),
    });
  }

  function update(resource, id, updatedData) {
    dispatch({
      type: ActionTypes.UPDATE,
      resource,
      id,
      data: updatedData,
    });
  }

  function updateQnaire(id, updatedData) {
    update("qnaire", id, updatedData);
  }

  function updateSection(id, updatedData) {
    update("sections", id, updatedData);
  }

  function updateQuestion(id, updatedData) {
    update("questions", id, updatedData);
  }

  function paste(type, id) {}

  const value = {
    ...qnaire,
    questions,
    sections,
    select,
    setData,
    updateQnaire,
    updateSection,
    updateQuestion,
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
