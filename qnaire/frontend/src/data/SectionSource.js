import { Resources } from "./Resources";
import { OrderedSource } from "./OrderedSource";

export class SectionSource extends OrderedSource {
  constructor(data = null) {
    super(Resources.SECTIONS, data);
  }

  getSortedSectionIds() {
    return this._sortIdsByOrder(Object.keys(this.data));
  }

  getSortedSections() {
    return this._sortByOrder(Object.values(this.data));
  }

  move(id, orderNum) {
    return this._move(id, { order_num: orderNum });
  }
}
