import { Resources } from "./Resources";
import { OrderedSource } from "./OrderedSource";

export class QuestionSource extends OrderedSource {
  constructor(data = null) {
    super(Resources.QUESTIONS, data);
  }

  getQuestionsForSection(id) {
    const filtered = this.getFilteredList(
      (question) => question.section == id
    );
    const sorted = this._sortByOrder(filtered);
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
    //call /type API endpoint here
  }

  move(id, orderNum, sectionId) {
    return this._move(id, { section: sectionId, order_num: orderNum });
  }
}
