import { Resources } from "../Resources";
import { OrderedSource } from "./OrderedSource";

export class QuestionSource extends OrderedSource {
  constructor(data = null) {
    super(Resources.QUESTIONS, data);
  }

  getQuestionIdsForSection(id) {
    const filtered = this.getFilteredIdList(
      (question) => question.section == id
    );
    const sorted = this._sortIdsByOrder(filtered);
    return sorted;
  }

  updateType(id, resourcetype) {
    const { section, text, mandatory, order_num } = this.get(id);
    let newQ = {
      section,
      text,
      mandatory,
      order_num,
      resourcetype,
    };
    switch (newQ.resourcetype) {
      case "OpenQuestion": {
        newQ = { ...newQ, min_length: null, max_length: null };
        break;
      }
      case "RangeQuestion": {
        newQ = { ...newQ, min: 1, max: 5, step: 1, type: 1 };
        break;
      }
      case "MultipleChoiceQuestion": {
        newQ = {
          ...newQ,
          min_answers: 0,
          max_answers: 0,
          other_choice: false,
          random_order: false,
        };
        break;
      }
    }
    //call /type API endpoint here
  }

  move(id, sectionId, orderNum) {
    return this._move(id, { section: sectionId, order_num: orderNum });
  }
}
