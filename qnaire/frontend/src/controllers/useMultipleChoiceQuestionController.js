import React, { useCallback, useEffect, useState } from "react";
import qnaireSource from "../data/QnaireSource";

export function useMultipleChoiceQuestionController(id) {
  const choiceSource = qnaireSource.choiceSource;

  const [choiceIds, setChoiceIds] = useState(() =>
    choiceSource.getChoiceIdsForQuestion(id)
  );

  const createChoice = useCallback(() => {
    const order_num = choiceIds.length;
    const text = `Možnost ${order_num + 1}`;
    choiceSource.create({ question: id, order_num, text });
  }, [id, choiceIds]);

  const handleChoiceOrderChange = useCallback(() => {
    setChoiceIds(choiceSource.getChoiceIdsForQuestion(id));
  }, [id]);

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
  }, [id]);

  return { choiceIds, createChoice };
}
