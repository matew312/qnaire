import { useTheme } from "@emotion/react";
import React, {
  useContext,
  useEffect,
  useState,
  useReducer,
  useMemo,
} from "react";

//do an effect when timeout passes, if the component is rerendered during the timeout, the timeout is reset
function useTimeoutEffect(callback, array, timeout = 1000) {
  useEffect(() => {
    const timerId = setTimeout(() => {
      callback();
    }, timeout);

    return () => clearTimeout(timerId);
  }, array);
}

export const useForceRender = () => {
  const [, forceRender] = useReducer((oldVal) => oldVal + 1, 0);
  return forceRender;
};

export const useScrollWhenSelected = (isSelected, ref) => {
  const theme = useTheme();
  useEffect(() => {
    if (isSelected) {
      var headerOffset = theme.mixins.toolbar.minHeight;
      var elementRect = ref.current.getBoundingClientRect();
      var offsetPosition =
        elementRect.top + window.pageYOffset - headerOffset - 40;

      if (
        elementRect.bottom > window.innerHeight ||
        elementRect.top < headerOffset
      ) {
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }
  }, [isSelected]);
};
