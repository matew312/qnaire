import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from "react";

const UPDATE_TIMEOUT = 7500;

export const useGenericController = (source, id) => {
  const [data, setData] = useState(() => source.get(id));
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
      updatedData = { ...pendingData.current, ...updatedData };
      pendingData.current = updatedData;
    }
    updateTimeoutId.current = setTimeout(() => {
      updateTimeoutId.current = null;
      pendingData.current = null;
      source
        .update(id, updatedData)
        .then((data) => {
          updateData({ ...data, error: "" });
        })
        .catch((error) => {
          updateData({ error });
        });
    }, UPDATE_TIMEOUT);
  };
  const cancelUpdate = () => {
    if (updateTimeoutId.current) {
      clearTimeout(updateTimeoutId.current);
      updateTimeoutId.current = null;
      pendingData.current = null;
    }
  };

  const destroy = () => {
    source.delete(id).catch((error) => {
      updateData({ error });
    });
  };

  return useMemo(() => {
    return [data, update, destroy, cancelUpdate];
  }, [data]); //the id never changes so the functions don't have to be in deps
};
