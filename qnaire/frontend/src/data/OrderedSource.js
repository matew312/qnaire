import { DataSource } from "./DataSource";
import { OrderedGateway } from "./OrderedGateway";

const OrderedEvents = {
  MOVE: "move",
};

export class OrderedSource extends DataSource {
  constructor(resource, data) {
    super(resource, data);
    this.gateway = new OrderedGateway(resource); //"override" the gateway
    //initialize subs for the new events
    Object.keys(OrderedEvents).forEach((key) => {
      this.subscribers[OrderedEvents[key]] = [];
    });
  }

  subscribeMove(callback) {
    this._subscribe(OrderedEvents.MOVE, callback);
  }

  _move(id, data) {
    if (this.data[srcId] === this.data[dstId]) {
      return;
    }
    return this.gateway.move(id, data).then((dict) => {
      Object.keys(dict).forEach((id) => {
        this.data[id] = dict[id];
      });
      this._notify(OrderedEvents.MOVE);
    });
  }
}
