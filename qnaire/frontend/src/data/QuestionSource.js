import { OrderedSource } from "./OrderedSource";

export class QuestionSource extends OrderedSource {
  move(id, sectionId, orderNum) {
    return this._move(id, { section: sectionId, order_num: orderNum });
  }
}
