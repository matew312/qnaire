import React, { useState, useMemo, useCallback, useEffect } from "react";

export const useGenericController = (source, id) => {
  const [data, setData] = useState(() => source.get(id));

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
      //data won't be updated here...
      // if (data.error) {
      //   // include the potentially erroneous data in the update if there is already an error
      //   updatedData = { ...data, ...updatedData };
      // }
      source
        .update(id, updatedData)
        .then((data) => {
          updateData({ ...data, error: "" });
        })
        .catch((error) => {
          updateData({ error });
        });
    },
    [id, data]
  );
  

  const destroy = useCallback(() => {
    source.delete(id).catch((error) => {
      updateData({ error });
    });
  }, [id]);

  return useMemo(() => {
    return [data, update, destroy];
  }, [data, update, destroy]);
};
