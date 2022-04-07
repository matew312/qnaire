import React, { useState, useMemo, useCallback } from "react";

export const useUpdatableState = (source, id) => {
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

  return useMemo(() => {
    return [data, update];
  }, [data]);
};
