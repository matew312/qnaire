import { combineReducers } from "./combineReducers";
import { Resources } from "./Resources";

export const ActionTypes = {
  SET: "set",
  UPDATE: "update",
  UPDATE_QUESTION_TYPE: "update_question_type",
  SET_ERROR: "set_error",
  CLEAR_ERROR: "clear_error",
};

//"SET" is not generic because I would need to post 3 dispatches to SET each (questions, sections, qnaire) instead of just one.
const GenericActionTypes = {
  [ActionTypes.UPDATE]: true,
  [ActionTypes.SET_ERROR]: true,
  [ActionTypes.CLEAR_ERROR]: true,
};

//NOTE: I keep the state immutable

function baseReducer(name, reducer, genericHandler) {
  return function (state, action) {
    if (action.type in GenericActionTypes) {
      if (action.resource === name) {
        return genericHandler(state, action);
      }
      return state;
    }
    return reducer(state, action);
  };
}

//base reducer for "dictionary reducers" (i.e. their part of state contains a property of the given name with dictionary value)
function dictReducer(name, reducer) {
  function handler(state, action) {
    const { data } = action;

    function getDict() {
      return state[name];
    }

    function getObj() {
      return getDict()[action.id];
    }

    function setObj(obj) {
      return {
        ...state,
        [name]: { ...getDict(), [action.id]: obj },
      };
    }

    function updateObj() {
      return setObj({ ...getObj(), ...data });
    }

    switch (action.type) {
      case ActionTypes.UPDATE:
        return updateObj();
    }
  }

  return baseReducer(name, reducer, handler);
}

//base reducer for "object reducers" (qnaire)
function objectReducer(name, reducer) {
  function handler(state, action) {
    switch (action.type) {
      case ActionTypes.UPDATE: {
        return {
          ...state,
          ...action.data,
        };
      }
    }
  }

  return baseReducer(name, reducer, handler);
}

function questionsReducer(state, action) {
  //extract the list of questions and the question of the given id from state (for better readability)
  function extractQandQs() {
    const { questions } = state;
    const question = questions[action.id];
    return [question, questions];
  }

  switch (action.type) {
    case ActionTypes.SET: {
      return {
        questions: action.data.questions,
      };
    }
    case ActionTypes.UPDATE_QUESTION_TYPE: {
      //api call: delete old question and create a new one
      const [q, qs] = extractQandQs();
      const { id, section, text, mandatory, order_num } = q;
      let newQ = {
        id,
        section,
        text,
        mandatory,
        order_num,
        ...action.data,
      };
      switch (newQ.resourcetype) {
        case "OpenQuestion": {
          newQ = { ...newQ, min_length: null, max_length: null };
          break;
        }
        case "RangeQuestion": {
          newQ = { ...newQ, min: 1, max: 5, step: 1, type: "slider" };
          break;
        }
        case "MultipleChoiceQuestion": {
          newQ = {
            ...newQ,
            min_answers: 0,
            max_answers: 0,
            other_choice: false,
            random_order: false,
            choices: {},
          };
          break;
        }
      }
      return {
        ...state,
        questions: { ...qs, [q.id]: newQ },
      };
    }
    default:
      return state;
  }
}

function choicesReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET: {
      return { choices: action.data.choices };
    }
    default:
      return state;
  }
}

function sectionsReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET: {
      return { sections: action.data.sections };
    }
    default:
      return state;
  }
}

function qnaireReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET: {
      const { id, name, anonymous, created_at } = action.data;
      return { id, name, anonymous, created_at };
    }
    //...
    default:
      return state;
  }
}

function otherReducer(state, action) {
  switch (action.type) {
    default:
      return state;
  }
}

export const reducer = combineReducers({
  [Resources.QNAIRES]: objectReducer(Resources.QNAIRES, qnaireReducer),
  [Resources.SECTIONS]: dictReducer(Resources.SECTIONS, sectionsReducer),
  [Resources.QUESTIONS]: dictReducer(Resources.QUESTIONS, questionsReducer),
  [Resources.CHOICES]: dictReducer(Resources.CHOICES, choicesReducer),
  [Resources.OTHER]: objectReducer(Resources.OTHER, otherReducer),
});
