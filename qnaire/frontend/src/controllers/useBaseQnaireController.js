import React, { useCallback, useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import qnaireSource from "../data/QnaireSource";
import { useQnaireContext } from "../providers/QnaireProvider";
import { useGenericController } from "./useGenericController";
import * as yup from "yup";
import { requiredString } from "../validation";
import { downloadTextFile } from "../utils";

const validationSchema = yup.object({
  name: requiredString,
  desc: yup.string(),
});

export function useBaseQnaireController(id, timeout = 750) {
  const [data, update, regularDestroy] = useGenericController(
    qnaireSource,
    id,
    validationSchema,
    timeout
  );

  const navigate = useNavigate();

  const publish = ({ isPrivate, isAnonymous }) => {
    return update({
      private: isPrivate,
      anonymous: isAnonymous,
      published: true,
    }).catch((error) => {
      setError(JSON.stringify(error));
    });
  };

  const destroy = () => {
    regularDestroy()
      .then(() => navigate("/questionnaires"))
      .catch((error) => {
        setError(JSON.stringify(error));
      });
  };

  const exportResult = () => {
    qnaireSource.retrieveResult(id).then((data) => {
      downloadTextFile(JSON.stringify(data, undefined, 2), `odpovědi.json`); //pretty printing the json
    });
  };

  const previewLink = `/questionnaires/${id}/response?preview`;

  const getLink = () => {
    const baseUrl = `${location.host}/questionnaires/${id}/response/`;
    if (data.private) {
      return qnaireSource.createPrivateId(id).then((data) => {
        return `${baseUrl}${data.id}/`;
      });
    }
    return Promise.resolve(baseUrl);
  };

  return {
    data,
    update,
    destroy,
    publish,
    previewLink,
    exportResult,
    getLink,
  };
}
