import React, { useState, useMemo, useCallback, useEffect } from "react";

export const useGenericController = (source, id) => {
  const [data, setData] = useState(() => source.get(id));

  const updateData = useCallback((updatedData) => {
    setData((data) => {
      return { ...data, ...updatedData };
    });
  }, []);

  const update = useCallback(
    (updatedData) => {
      updateData(updatedData);
      source
        .update(id, updatedData)
        .then((data) => {
          updateData(data);
        })
        .catch((error) => {
          updateData({ error });
        });
    },
    [id]
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
