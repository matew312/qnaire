import React, {
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import AddBoxIcon from "@mui/icons-material/AddBox";
import AddIcon from "@mui/icons-material/Add";
import { useAppContext } from "./AppContextProvider";
import { PageAction } from "../PageAction";
import qnaireSource from "../data/QnaireSource";
import { Resources } from "../Resources";

const QnaireContext = React.createContext();

export function QnaireProvider({ children }) {
  const [selected, setSelected] = useState(null);
  const [copiedQuestion, setCopiedQuestion] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const select = useCallback((resource, id) => {
    qnaireSource.flush();
    setSelected({ resource, id });
  }, []);

  function findMaxOrderNum(objects) {
    return Object.keys(objects).reduce((max, id) => {
      const order_num = objects[id].order_num;
      return order_num > max ? order_num : max;
    }, 0);
  }

  function createSection() {
    const sections = qnaireSource.sectionSource.getAll();
    let order_num = 0;
    if (selected) {
      switch (selected.resource) {
        case Resources.QNAIRES:
          order_num = findMaxOrderNum(sections) + 1;
          break;
        case Resources.SECTIONS:
          order_num = sections[selected.id].order_num + 1;
          break;
        case Resources.QUESTIONS:
          const question = qnaireSource.questionSource.get(selected.id);
          order_num = sections[question.section].order_num + 1;
          break;
      }
    } else {
      order_num = findMaxOrderNum(sections) + 1;
    }
    const name = `Sekce ${order_num + 1}`;
    const data = { name, order_num, qnaire: qnaireSource.id };

    qnaireSource.sectionSource.create(data).then((data) => {
      select(Resources.SECTIONS, data.id);
    });
  }

  function createQuestion() {}

  function paste(type, id) {}

  const value = {
    select,
    selected,
  };

  const { setPageActions } = useAppContext();

  useEffect(() => {
    const handleLoad = () => setIsLoaded(true);
    qnaireSource.subscribeLoad(handleLoad);

    return () => {
      qnaireSource.unsubscribeLoad(handleLoad);
    };
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }
    const pageActions = [
      new PageAction("Přidat sekci", <AddBoxIcon />, createSection),
      new PageAction("Přidat otázku", <AddIcon />, createQuestion),
    ];
    setPageActions(pageActions);
    // return () => setPageActions([]);
  }, [isLoaded, selected]);

  return (
    <QnaireContext.Provider value={value}>{children}</QnaireContext.Provider>
  );
}

export function useQnaireContext() {
  const context = useContext(QnaireContext);
  if (context === undefined) {
    throw new Error(
      "useQnaireContext must be used inside QnaireContextProvider"
    );
  }
  return context;
}

function useSelect(resource, id) {
  const { selected, select } = useQnaireContext();
  return useMemo(() => {
    return {
      isSelected: Boolean(
        selected && selected.id == id && selected.resource === resource
      ),
      select: () => select(resource, id),
    };
  }, [select, selected]);
}

export function useQnaireSelect(id) {
  return useSelect(Resources.QNAIRES, id);
}

export function useSectionSelect(id) {
  return useSelect(Resources.SECTIONS, id);
}

export function useQuestionSelect(id) {
  return useSelect(Resources.QUESTIONS, id);
}
