import MultipleChoiceQuestion from "./components/MultipleChoiceQuestion";
import OpenQuestion from "./components/OpenQuestion";
import RangeQuestion from "./components/RangeQuestion";

export const QuestionTypes = {
    OpenQuestion: {
      component: OpenQuestion,
      desc: "Otevřená otázka",
    },
    RangeQuestion: {
      component: RangeQuestion,
      desc: "Výběr čísla z rozmezí",
    },
    MultipleChoiceQuestion: {
      component: MultipleChoiceQuestion,
      desc: "Výběr z možností",
    },
  };