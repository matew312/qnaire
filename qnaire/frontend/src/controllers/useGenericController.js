import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from "react";

const UPDATE_TIMEOUT = 750;

export const useGenericController = (source, id) => {
  const [data, setData] = useState(() => source.get(id));
  const updateTimeoutId = useRef(null);
  const pendingData = useRef(null);

  const updateData = useCallback((updatedData) => {
    setData((data) => {
      return { ...data, ...updatedData };
    });
  }, []);

  const update = useCallback(
    (updatedData, shouldSourceUpdate = true) => {
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
    },
    [id]
  );

  const cancelUpdate = useCallback(() => {
    if (updateTimeoutId.current) {
      clearTimeout(updateTimeoutId.current);
      updateTimeoutId.current = null;
      pendingData.current = null;
    }
  }, []);

  const destroy = useCallback(() => {
    source.delete(id).catch((error) => {
      updateData({ error });
    });
  }, [id]);

  return useMemo(() => {
    return [data, update, destroy, cancelUpdate];
  }, [data, update, destroy]);
};
