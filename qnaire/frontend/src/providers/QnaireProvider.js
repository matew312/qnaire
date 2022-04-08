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
import { Resources } from "../data/Resources";

const QnaireContext = React.createContext();

export function QnaireProvider({ children }) {
  const [selected, setSelected] = useState(null);
  const [copiedQuestion, setCopiedQuestion] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState("");

  const select = useCallback((resource, id) => {
    qnaireSource.flush();
    setSelected({ resource, id });
  }, []);

  function createSection() {
    const sections = qnaireSource.sectionSource.getAll();
    let order_num = null;
    if (selected) {
      switch (selected.resource) {
        case Resources.QNAIRES:
          break;
        case Resources.SECTIONS:
          order_num = sections[selected.id].order_num + 1;
          break;
        case Resources.QUESTIONS:
          const question = qnaireSource.questionSource.get(selected.id);
          order_num = sections[question.section].order_num + 1;
          break;
      }
    }

    if (order_num == null) {
      order_num = Object.keys(sections).length;
    }

    const name = `Sekce ${order_num + 1}`;
    const data = { name, order_num, qnaire: qnaireSource.id };

    qnaireSource.sectionSource.create(data).then((data) => {
      select(Resources.SECTIONS, data.id);
    });
  }

  function createQuestion() {
    const questionSource = qnaireSource.questionSource;
    const sections = qnaireSource.sectionSource.getAll();
    if (Object.keys(sections).length == 0) {
      setError(
        "Každá otázka musí patřit do nějaké sekce, a v tomto dotazníku žádná není."
      );
    }
    let order_num = null;
    let sectionId = null;
    let resourcetype = "MultipleChoiceQuestion";
    if (selected) {
      switch (selected.resource) {
        case Resources.QNAIRES:
          break;
        case Resources.SECTIONS:
          sectionId = selected.id;
          break;
        case Resources.QUESTIONS:
          const questions = questionSource.getAll();
          const question = questions[selected.id];
          sectionId = question.section;
          order_num = question.order_num + 1;
          resourcetype = question.resourcetype; //use the same type as the currently selected question
          break;
      }
    }
    if (sectionId == null) {
      // take last one
      const sortedSectionIds = qnaireSource.sectionSource.getSortedSectionIds();
      sectionId = sortedSectionIds[sortedSectionIds.length - 1];
    }

    if (order_num == null) {
      order_num = questionSource.getQuestionIdsForSection(sectionId).length;
    }

    const text = `Otázka ${order_num + 1}`;
    const data = { text, order_num, section: sectionId, resourcetype };
    questionSource.create(data).then((data) => {
      select(Resources.QUESTIONS, data.id);
    });
  }

  function copy() {

  }

  function paste() {

  }

  const value = {
    select,
    selected,
    error,
    setError,
    copy,
    paste,
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
