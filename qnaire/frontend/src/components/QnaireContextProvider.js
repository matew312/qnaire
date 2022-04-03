import React, {
  useReducer,
  useContext,
  useRef,
  useEffect,
  useMemo,
} from "react";
import AddBoxIcon from "@mui/icons-material/AddBox";
import AddIcon from "@mui/icons-material/Add";
import { reducer, ActionTypes } from "../reducers";
import { GET, PATCH, POST, DELETE } from "../request";
import { Resources } from "../Resources";
import { useAppContext } from "./AppContextProvider";
import { PageAction } from "../PageAction";

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

  const { selected } = other || {};

  function setData(data) {
    dispatch({ type: ActionTypes.SET, data });
  }

  function select(resource, id) {
    updateTimeout.current = null; //prevent cancel of the update to the previous selected component

    dispatch({
      type: ActionTypes.UPDATE,
      resource: Resources.OTHER,
      data: { selected: new ResourceId(resource, id) },
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

  function updateQnaire(updatedData) {
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

  function findMaxOrderNum(objects) {
    return Object.keys(objects).reduce((max, id) => {
      const order_num = objects[id].order_num;
      return order_num > max ? order_num : max;
    }, 0);
  }

  function createSection() {
    let order_num = 0;
    if (selected) {
      switch (selected.resource) {
        case Resources.QNAIRES:
          order_num = findMaxOrderNum(sections) + 1;
          break;
        case Resources.SECTIONS:
          order_num = selected.order_num + 1;
          break;
        case Resources.QUESTIONS:
          order_num = sections[selected.section].order_num + 1;
          break;
      }
    } else {
      order_num = findMaxOrderNum(sections) + 1;
    }
    const name = `Sekce ${order_num + 1}`;
    const data = { name, order_num };

    //I can't dispatch without id, so POST first

    POST(Resources.SECTIONS, { ...data, qnaire: id }).then((data) => {
      dispatch({
        type: ActionTypes.CREATE,
        resource: Resources.SECTIONS,
        data,
      });
      select(Resources.SECTIONS, data.id);
    });
  }

  function createQuestion() {}

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

  const { setPageActions } = useAppContext();

  useEffect(() => {
    const pageActions = [
      new PageAction("Přidat sekci", <AddBoxIcon />, createSection),
      new PageAction("Přidat otázku", <AddIcon />, createQuestion),
    ];
    setPageActions(pageActions);
    // return () => setPageActions([]);
  }, [selected, questions, sections]); //the effect needs to be executed when these change, because the old callbacks use old state

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
