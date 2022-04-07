import React, { useCallback, useEffect, useState } from "react";
import qnaireSource from "../data/QnaireSource";

export function useMultipleChoiceQuestionController(id) {
  const choiceSource = qnaireSource.choiceSource;
  const questionSource = qnaireSource.questionSource;

  const [choiceIds, setChoiceIds] = useState(() =>
    choiceSource.getChoiceIdsForQuestion(id)
  );

  const handleChoiceOrderChange = useCallback(() => {
    setChoiceIds(choiceSource.getChoiceIdsForQuestion(id));
  }, [id]);

  useEffect(() => {
    //this could be optimized by allowing to sub the question by id so that its notified only when change related to it happens
    questionSource.subscribeMove(handleChoiceOrderChange);
    questionSource.subscribeCreate(handleChoiceOrderChange);
    questionSource.subscribeDelete(handleChoiceOrderChange);

    return () => {
      questionSource.unsubscribeMove(handleChoiceOrderChange);
      questionSource.unsubscribeCreate(handleChoiceOrderChange);
      questionSource.unsubscribeDelete(handleChoiceOrderChange);
    };
  }, [id]);

  return { choiceIds };
}
