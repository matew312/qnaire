import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { yupErrorToFieldErrors } from "../validation";

export const DEFAULT_TIMEOUT = 600;

export const useGenericController = (
  source,
  id,
  validationSchema = null,
  timeout = DEFAULT_TIMEOUT
) => {
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

    if (updateTimeoutId.current) {
      clearTimeout(updateTimeoutId.current);
      updateTimeoutId.current = null;
    }
    updatedData = { ...pendingData.current, ...updatedData };
    pendingData.current = updatedData;

    if (validationSchema) {
      try {
        validationSchema.validateSync(
          {
            ...data, //passing the rest of the data so that required fields don't have to be in updatedData
            ...updatedData,
          },
          { abortEarly: false }
        );
      } catch (error) {
        updateData({ error: yupErrorToFieldErrors(error) });
        return;
      }
    }

    return new Promise((resolve) => {
      updateTimeoutId.current = setTimeout(() => {
        resolve();
      }, timeout);
    }).then(() => {
      updateTimeoutId.current = null;
      return source
        .update(id, updatedData)
        .then((data) => {
          updateData({ ...data, error: {} });
          pendingData.current = null;
        })
        .catch((error) => {
          updateData({ error });
          //keep the pendingData on Error
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
