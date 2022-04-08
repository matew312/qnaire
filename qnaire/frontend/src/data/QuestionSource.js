import { Resources } from "./Resources";
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
    //call /type API endpoint here
  }

  move(id, sectionId, orderNum) {
    return this._move(id, { section: sectionId, order_num: orderNum });
  }
}
