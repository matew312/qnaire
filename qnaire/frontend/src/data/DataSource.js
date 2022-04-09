import { DataGateway } from "./DataGateway";

export const DataEvents = {
  CREATE: "create",
  UPDATE: "update",
  DELETE: "delete",
};

//The data source always starts with initial data and allows creates, updates and deletes
// and allows subscribers to be notified on these events. It keeps the latest VALID data.
export class DataSource {
  constructor(resource, data = null) {
    this.gateway = new DataGateway(resource);
    this.data = data;
    this.subscribers = {};
    Object.keys(DataEvents).forEach((key) => {
      this.subscribers[DataEvents[key]] = [];
    });
  }

  _setData(data) {
    this.data = data;
  }

  _notify(event) {
    this.subscribers[event].forEach((sub) => {
      sub();
    });
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

  _unsubscribe(resource, callback) {
    this.subscribers[resource] = this.subscribers[resource].filter(
      (sub) => sub !== callback
    );
  }

  unsubscribeCreate(callback) {
    this._unsubscribe(DataEvents.CREATE, callback);
  }

  unsubscribeUpdate(callback) {
    this._unsubscribe(DataEvents.UPDATE, callback);
  }

  unsubscribeDelete(callback) {
    this._unsubscribe(DataEvents.DELETE, callback);
  }

  get(id) {
    if (this.data && id in this.data) {
      return this.data[id];
    }
    return null;
  }
  getAll() {
    return this.data;
  }

  getFilteredList(filterFunc) {
    return Object.values(this.data).reduce((filtered, obj) => {
      if (filterFunc(obj)) {
        filtered.push(obj);
      }
      return filtered;
    }, []);
  }

  create(data) {
    return this.gateway.create(data).then((data) => {
      this.data[data.id] = data;
      this._notify(DataEvents.CREATE, data);
      return data;
    });
  }

  //partial update
  update(id, updatedData, notify = true) {
    return this.gateway.update(id, updatedData).then((data) => {
      this.data[data.id] = data;
      if (notify) {
        this._notify(DataEvents.UPDATE);
      }
      return data;
    });
  }

  delete(id) {
    return this.gateway.delete(id).then(() => {
      delete this.data[id];
      this._notify(DataEvents.DELETE);
    });
  }
}
