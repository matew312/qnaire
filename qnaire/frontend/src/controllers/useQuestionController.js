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
      //questionSource.updateType(id, updatedData.resourcetype);
      //TODo...
    } else {
      regularUpdate(
        { ...updatedData, resourcetype: data.resourcetype },
        shouldSourceUpdate
      );
    }
  };

  return { ...data, update, destroy };
}
