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

  return { ...questionController, choices, createChoice };
}
