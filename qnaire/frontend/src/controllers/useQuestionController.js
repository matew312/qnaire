import React, { useEffect, useState, useCallback } from "react";
import qnaireSource from "../data/QnaireSource";
import { useGenericController } from "./useGenericController";

export function useQuestionController(id) {
  const questionSource = qnaireSource.questionSource;

  const [data, regularUpdate, destroy, cancelPendingUpdate] =
    useGenericController(questionSource, id);
  const update = (updatedData, shouldSourceUpdate = true) => {
    if ("resourcetype" in updatedData) {
      cancelPendingUpdate();
      // there might be an issue if an update was sent shortly before this one
      // if the response to this one arrives before the first one, because react could have destroyed the old component by then
      questionSource.updateType(id, updatedData.resourcetype);
    } else {
      regularUpdate(
        { ...updatedData, resourcetype: data.resourcetype },
        shouldSourceUpdate
      );
    }
  };

  return { ...data, update, destroy };
}
