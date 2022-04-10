import React, { useCallback, useEffect, useState } from "react";
import qnaireSource from "../data/QnaireSource";
import { useGenericController } from "./useGenericController";

export function useSectionController(id) {
  const sectionSource = qnaireSource.sectionSource;
  const questionSource = qnaireSource.questionSource;

  const [data, update, destroy] = useGenericController(sectionSource, id);
  const [questions, setQuestions] = useState(() => {
    return questionSource.getQuestionsForSection(id);
  });

  const handleQuestionOrderChange = () => {
    setQuestions(questionSource.getQuestionsForSection(id));
  };

  useEffect(() => {
    //this could be optimized by allowing to sub the section by id so that its notified only when change related to it happens
    questionSource.subscribeMove(handleQuestionOrderChange);
    questionSource.subscribeCreate(handleQuestionOrderChange);
    questionSource.subscribeDelete(handleQuestionOrderChange);
    questionSource.subscribeType(handleQuestionOrderChange); //the Section is doing the question component mapping, so it needs to rerender

    return () => {
      questionSource.unsubscribeMove(handleQuestionOrderChange);
      questionSource.unsubscribeCreate(handleQuestionOrderChange);
      questionSource.unsubscribeDelete(handleQuestionOrderChange);
      questionSource.unsubscribeType(handleQuestionOrderChange);
    };
  }, [id]);

  return {
    ...data,
    questions,
    update,
    destroy,
  };
}
