import { Resources } from "./Resources";
import { GET, PATCH, POST, DELETE } from "../request";
import { DISPLAY_TYPES } from "../components/RangeQuestionOptions";
import { SectionSource } from "./SectionSource";
import { DataSource } from "./DataSource";
import { QuestionSource } from "./QuestionSource";
import { ChoiceSource } from "./ChoiceSource";

const QnaireEvents = {
  LOAD: "load",
};

class QnaireSource extends DataSource {
  constructor() {
    super(Resources.QNAIRES);
    this.id = null;

    this.sectionSource = new SectionSource();
    this.questionSource = new QuestionSource();
    this.choiceSource = new ChoiceSource();
    this.subscribers[QnaireEvents.LOAD] = [];
  }

  subscribeLoad(callback) {
    this._subscribe(QnaireEvents.LOAD, callback);
  }

  unsubscribeLoad(callback) {
    this._unsubscribe(QnaireEvents.LOAD, callback);
  }

  retrieve(id) {
    this.id = id;
    return this.gateway.retrieve(this.id).then((data) => {
      const { sections, questions, choices, ...qnaire } = data;
      this.sectionSource._setData(sections);
      this.questionSource._setData(questions);
      this.choiceSource._setData(choices);
      this._setData(qnaire);
      this._notify(QnaireEvents.LOAD);
      return this.data;
    });
  }

  flush() {
    super.flush();
    this.sectionSource.flush();
    this.questionSource.flush();
    this.choiceSource.flush();
  }
}

//singleton
const qnaireSource = new QnaireSource();
export default qnaireSource;
