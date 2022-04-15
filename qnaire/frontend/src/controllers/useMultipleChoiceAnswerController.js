import * as React from "react";
import qnaireSource from "../data/QnaireSource";
import useAnswerController from "./useAnswerController";
import { shuffleArray } from "../utils";

export default function useMultipleChoiceAnswerController({
  question,
  setAnswer,
  answer,
  ...props
}) {
  const choices = React.useMemo(() => {
    const sortedChoices = qnaireSource.choiceSource.getChoicesForQuestion(
      question.id
    );
    if (!question.random_order) {
      return sortedChoices;
    } else {
      return shuffleArray(sortedChoices);
    }
  }, [question]);

  console.log(answer);

  const addChoice = (choice) => {
    const selectedChoices = answer.choices ? answer.choices : [];
    setAnswer(question, {
      ...answer,
      choices: [...selectedChoices, choice],
    });
  };

  const removeChoice = (choice) =>
    setAnswer(question, {
      ...answer,
      choices: answer.choices.filter((choiceId) => choiceId !== choice),
    });

  const addOtherChoice = (text) => {
    setAnswer(question, {
      ...answer,
      other_choice_text: text,
    });
  };

  const removeOtherChoice = () => {
    setAnswer(question, {
      ...answer,
      other_choice_text: "",
    });
  };

  const setChoice = (choice, isOtherChoice = false) => {
    if (!isOtherChoice) {
      setAnswer(question, {
        choices: [choice],
        other_choice_text: "",
      });
    } else {
      setAnswer(question, {
        choices: null,
        other_choice_text: choice,
      });
    }
  };

  return {
    question,
    choices,
    addChoice,
    addOtherChoice,
    removeChoice,
    removeOtherChoice,
    setChoice,
    answer,
    ...props,
  };
}
