import React, { useCallback, useEffect, useState } from "react";
import qnaireSource from "../data/QnaireSource";
import { useQuestionController } from "./useQuestionController";

export function useMultipleChoiceQuestionController(id) {
  const questionController = useQuestionController(id);

  const choiceSource = qnaireSource.choiceSource;
  const [choices, setChoices] = useState(() =>
    choiceSource.getChoicesForQuestion(id)
  );
  

  const createChoice = () => {
    const order_num = choices.length;
    const text = `Možnost ${order_num + 1}`;
    choiceSource.create({ question: id, order_num, text });
  };

  const handleChoiceOrderChange = () => {
    setChoices(choiceSource.getChoicesForQuestion(id));
  };

  useEffect(() => {
    //this could be optimized by allowing to sub the question by id so that its notified only when change related to it happens
    choiceSource.subscribeMove(handleChoiceOrderChange);
    choiceSource.subscribeCreate(handleChoiceOrderChange);
    choiceSource.subscribeDelete(handleChoiceOrderChange);

    return () => {
      choiceSource.unsubscribeMove(handleChoiceOrderChange);
      choiceSource.unsubscribeCreate(handleChoiceOrderChange);
      choiceSource.unsubscribeDelete(handleChoiceOrderChange);
    };
  }, []);

  useEffect(() => {
    if (
      questionController.max_answers !== null &&
      questionController.max_answers > choices.length
    ) {
      //the server already updated the question during the deletion of the choice,
      // but I will do shouldSourceUpdate to true so that I keep the local DataSource in a consistent state
      // (thought it's not strictly necessary right now)
      questionController.update({ max_answers: choices.length });
    }
  }, [choices.length]);

  return { ...questionController, choices, createChoice };
}
