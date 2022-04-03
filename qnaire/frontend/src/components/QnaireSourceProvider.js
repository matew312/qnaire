import * as React from "react";
import AddBoxIcon from "@mui/icons-material/AddBox";
import AddIcon from "@mui/icons-material/Add";
import { QnaireSource } from "../data/QnaireSource";
import { PageAction } from "../PageAction";
import { GET } from "../request";
import { Resources } from "../Resources";
import { useAppContext } from "./AppContextProvider";

const QnaireSourceContext = React.createContext();

export function QnaireSourceProvider({ id, children }) {
  const [qnaireSource, setQnaireSource] = React.useState(null);
  React.useEffect(() => {
    GET(`${Resources.QNAIRES}/${id}`).then((data) => {
      setQnaireSource(new QnaireSource(data));
    });
  }, []);

  const { setPageActions } = useAppContext();
  React.useEffect(() => {
    if (!qnaireSource) {
      return;
    }

    const pageActions = [
      new PageAction(
        "Přidat sekci",
        <AddBoxIcon />,
        qnaireSource.createSection.bind(qnaireSource)
      ),
      new PageAction(
        "Přidat otázku",
        <AddIcon />,
        qnaireSource.createQuestion.bind(qnaireSource)
      ),
    ];
    setPageActions(pageActions);
  }, [qnaireSource]);

  return (
    <QnaireSourceContext.Provider value={qnaireSource}>
      {qnaireSource ? children : null}
    </QnaireSourceContext.Provider>
  );
}

export const useQnaireSource = () => React.useContext(QnaireSourceContext);
