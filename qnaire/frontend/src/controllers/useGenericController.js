import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { yupErrorToFieldErrors } from "../validation";

const UPDATE_TIMEOUT = 750;

export const useGenericController = (source, id, validationSchema = null) => {
  const [data, setData] = useState(() => {
    return { ...source.get(id), error: {} };
  });
  const updateTimeoutId = useRef(null);
  const pendingData = useRef(null);

  const updateData = (updatedData) => {
    setData((data) => {
      return { ...data, ...updatedData };
    });
  };

  const update = (updatedData, shouldSourceUpdate = true) => {
    updateData(updatedData);
    if (!shouldSourceUpdate) {
      return;
    }
    if (validationSchema) {
      try {
        if (
          !validationSchema.isValidSync({
            ...data, //passing the rest of the data so that required fields don't have to be in updatedData
            ...updatedData,
          })
        ) {
          validationSchema.validateSync({
            ...data, //passing the rest of the data so that required fields don't have to be in updatedData
            ...updatedData,
          });
        }
      } catch (error) {
        updateData({ error: yupErrorToFieldErrors(error) });
        return;
      }
    }
    if (updateTimeoutId.current) {
      clearTimeout(updateTimeoutId.current);
      updateTimeoutId.current = null;
      updatedData = { ...pendingData.current, ...updatedData };
      pendingData.current = updatedData;
    }

    return new Promise((resolve) => {
      updateTimeoutId.current = setTimeout(() => {
        resolve();
      }, UPDATE_TIMEOUT);
    }).then(() => {
      updateTimeoutId.current = null;
      pendingData.current = null;
      return source
        .update(id, updatedData)
        .then((data) => {
          updateData({ ...data, error: {} });
        })
        .catch((error) => {
          updateData({ error });
        });
    });
  };
  const cancelUpdate = () => {
    if (updateTimeoutId.current) {
      clearTimeout(updateTimeoutId.current);
      updateTimeoutId.current = null;
      pendingData.current = null;
    }
  };

  const destroy = () => {
    return source.delete(id).catch((error) => {
      updateData({ error });
    });
  };

  return useMemo(() => {
    return [data, update, destroy, cancelUpdate];
  }, [data]); //the id never changes so the functions don't have to be in deps
};
