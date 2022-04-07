import { DataGateway } from "./DataGateway";

export const DataEvents = {
  CREATE: "create",
  UPDATE: "update",
  DELETE: "delete",
};

const UPDATE_TIMEOUT = 750;

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
    this.updateTimeout = null;
  }

  _setData(data) {
    this.data = data;
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

  _unsubscribe(resource, callback) {
    let subs = this.subscribers[resource];
    subs = subs.filter(function (sub) {
      return sub !== callback;
    });
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
    return this.data ? this.data[id] : null;
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

  getFilteredIdList(filterFunc) {
    return Object.keys(this.data).reduce((filtered, id) => {
      if (filterFunc(this.data[id])) {
        filtered.push(id);
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
  update(id, updatedData, notify = true, timeout = UPDATE_TIMEOUT) {
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
      this.updateTimeout = null;
    }

    const delayPromise = new Promise((resolve) => {
      this.updateTimeout = setTimeout(() => resolve(), timeout);
    });

    return delayPromise
      .then(() => {
        return this.gateway.update(id, updatedData);
      })
      .then((data) => {
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

  flush() {
    this.updateTimeout = null; //
  }
}
