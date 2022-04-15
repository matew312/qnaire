import * as React from "react";

export default function useAnswerController({
  question,
  setAnswer: setAnswerByQuestion,
  ...props
}) {
  const setAnswer = (value) => {
    setAnswerByQuestion(question, value);
  };

  return { setAnswer, question, ...props };
}
