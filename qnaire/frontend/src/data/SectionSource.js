import { OrderedSource } from "./OrderedSource";

export class SectionSource extends OrderedSource {
  move(id, orderNum) {
    return this._move(id, { order_num: orderNum });
  }
}
