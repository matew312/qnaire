import { Resources } from "../Resources";
import { OrderedSource } from "./OrderedSource";

export class ChoiceSource extends OrderedSource {
  constructor(data = null) {
    super(Resources.SECTIONS, data);
  }

  getChoiceIdsForQuestion(id) {
    const filtered = this.getFilteredIdList((choice) => choice.question == id);
    const sorted = this._sortIdsByOrder(filtered);
    return sorted;
  }

  move(id, orderNum) {
    return this._move(id, { order_num: orderNum });
  }
}
