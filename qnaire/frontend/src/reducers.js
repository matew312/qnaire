import { combineReducers } from "./combineReducers";

export const ActionTypes = {
  SET: "set",
  SELECT: "select",
  UPDATE: "update_question",
  UPDATE_QUESTION_TYPE: "update_question_type",
  UPDATE_QUESTION_CHOICE: "update_question_choice",
};

//"SET" is not generic because I would need to post 3 dispatches to SET each (questions, sections, qnaire) instead of just one.
const GenericActionTypes = (({ UPDATE }) => ({ UPDATE }))(ActionTypes); //this notation extracts the given properties from the object


//NOTE: I keep the state immutable

function handleGenericActions(state, action) {
  const { name, data } = action;

  function extractListAndObj() {
    const list = state[name];
    const obj = list[action.id];
    return [list, obj];
  }

  switch (action) {
    case ActionTypes.UPDATE: {
      const [list, obj] = extractListAndObj();
      return {
        ...state,
        [name]: { ...list, obj: { ...obj, ...data } },
      };
    }
  }
}

function questionsReducer(state, action) {
  //extract the list of questions and the question of the given id from state (for better readability)
  function extractQandQs() {
    const { questions } = state;
    const question = questions[action.id];
    return [question, questions];
  }

  if (action.type in GenericActionTypes) {
    return handleGenericActions(state, action);
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
    case ActionTypes.UPDATE_QUESTION_CHOICE: {
      const [q, qs] = extractQandQs();
      return {
        ...state,
        questions: {
          ...qs,
          [q.id]: {
            ...q,
            choices: {
              ...q.choices,
              [action.choiceId]: {
                ...q.choices[action.choiceId],
                ...action.data,
              },
            },
          },
        },
      };
    }
    default:
      return state;
  }
}

function sectionsReducer(state, action) {
  if (action.type in GenericActionTypes) {
    return handleGenericActions(state, action);
  }

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
    case ActionTypes.SELECT: {
      return { ...state, selected: action.data };
    }
    //...
    default:
      return state;
  }
}

export const reducer = combineReducers({
  qnaire: qnaireReducer,
  sections: sectionsReducer,
  questions: questionsReducer,
});
