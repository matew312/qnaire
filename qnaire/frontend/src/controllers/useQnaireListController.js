import React, { useCallback, useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import qnaireSource from "../data/QnaireSource";
import { useGenericController } from "./useGenericController";

export function useQnaireListController() {
  const [qnaires, setQnaires] = useState(null);
  const navigate = useNavigate();

  const update = (id, updatedData) => {
    return qnaireSource.update(id, updatedData).then((data) => {
      setQnaires((qnaires) => {
        return { ...qnaires, [id]: data };
      });
    });
    // .catch((error) => {
    // });
  };

  const create = (data) => {
    return qnaireSource.create(data).then((data) => {
      navigate(`/questionnaires/${data.id}`);
    });
  };

  const getLink = (id) => {
    const baseUrl = `${location.host}/questionnaires/${id}/response/`;
    if (qnaires[id].private) {
      return qnaireSource.createPrivateId(id).then((data) => {
        return `${baseUrl}${data.id}/`;
      });
    }
    return Promise.resolve(baseUrl);
  };

  useEffect(() => {
    qnaireSource.retrieveAll().then((qnaires) => {
      setQnaires(qnaires);
    });
  }, []);

  const qnaireList = qnaires
    ? Object.values(qnaires).sort(
        (a, b) => new Date(b.last_modified) - new Date(a.last_modified)
      )
    : [];

  return {
    qnaires: qnaireList,
    isLoaded: Boolean(qnaires),
    update,
    getLink,
    create,
  };
}
