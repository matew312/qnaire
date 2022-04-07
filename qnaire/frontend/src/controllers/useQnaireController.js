import React, { useCallback, useEffect, useReducer, useState } from "react";
import qnaireSource from "../data/QnaireSource";
import { useUpdatableState } from "./useUpdatableState";

export function useQnaireController(id) {
  const [data, update] = useUpdatableState(qnaireSource, id);
  const [isLoaded, setIsLoaded] = useState(false);

  const [sectionIds, setSectionIds] = useState(null);

  const handleSectionOrderChange = useCallback(() => {
    setSectionIds(qnaireSource.sectionSource.getSortedSectionIds());
  }, [id]);

  useEffect(() => {
    qnaireSource.retrieve(id).then((data) => {
      update(data);
      const sectionSource = qnaireSource.sectionSource;
      setSectionIds(sectionSource.getSortedSectionIds());
      setIsLoaded(true);
      sectionSource.subscribeMove(handleSectionOrderChange);
      sectionSource.subscribeCreate(handleSectionOrderChange);
      sectionSource.subscribeDelete(handleSectionOrderChange);

      //there is not really a need to unsub because qnaire never gets deleted while this component is alive
      return () => {
        sectionSource.unsubscribeMove(handleSectionOrderChange);
        sectionSource.unsubscribeCreate(handleSectionOrderChange);
        sectionSource.unsubscribeDelete(handleSectionOrderChange);
      };
    });
  }, [id]);

  return { ...data, sectionIds, update, isLoaded };
}
