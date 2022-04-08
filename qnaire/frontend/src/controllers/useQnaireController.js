import React, { useCallback, useEffect, useReducer, useState } from "react";
import qnaireSource from "../data/QnaireSource";
import { useGenericController } from "./useGenericController";

export function useQnaireController(id) {
  const [data, update] = useGenericController(qnaireSource, id);
  const [isLoaded, setIsLoaded] = useState(false);

  const [sections, setSections] = useState(null);

  const handleSectionOrderChange = useCallback(() => {
    setSections(qnaireSource.sectionSource.getSortedSections());
  }, [id]);

  useEffect(() => {
    qnaireSource.retrieve(id).then((data) => {
      update(data, false); //passed shouldSourceUpdate=false to prevent unnecessary api call
      const sectionSource = qnaireSource.sectionSource;
      setSections(sectionSource.getSortedSections());
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

  return { ...data, sections, update, isLoaded };
}
