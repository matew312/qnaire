import { DataGateway } from "./DataGateway";

const DataEvents = {
  CREATE: "create",
  UPDATE: "update",
  DELETE: "delete",
};

//The data source always starts with initial data and allows creates, updates and deletes
// and allows subscribers to be notified on these events. It keeps the latest VALID data.
export class DataSource {
  constructor(resource, data) {
    this.gateway = new DataGateway(resource);
    this.data = data;
    this.subscribers = {};
    Object.keys(DataEvents).forEach((key) => {
      this.subscribers[DataEvents[key]] = [];
    });
  }

  _notify(event) {
    this.subscribers[event].forEach((sub) => sub());
  }

  _subscribe(event, callback) {
    this.subscribers[event].push(callback);
  }

  subscribeCreate(callback) {
    this._subscribe(DataEvents.CREATE, callback);
  }

  subscribeUpdate(callback) {
    this._subscribe(DataEvents.UPDATE, callback);
  }

  subscribeDelete(callback) {
    this._subscribe(DataEvents.DELETE, callback);
  }

  get(id) {
    return this.data[id];
  }
  getAll() {
    return this.data;
  }

  create(data) {
    return this.gateway.create(data).then((data) => {
      this.data[data.id] = data;
      this._notify(DataEvents.CREATE, data);
    });
  }

  //partial update
  update(id, updatedData, notify = true) {
    return this.gateway.update(id, updatedData).then((data) => {
      this.data[data.id] = data;
      if (notify) {
        this._notify(DataEvents.UPDATE);
      }
    });
  }

  delete(id) {
    return this.gateway.delete(id).then(() => {
      delete this.data[id];
      this._notify(DataEvents.DELETE);
    });
  }
}
