import { DELETE, GET, PATCH, POST } from "../request";

export class DataGateway {
  constructor(resource) {
    this.resource = resource;
  }

  retrieve(id) {
    return GET(`${this.resource}/${id}`);
  }
  retrieveAll() {
    return GET(`${this.resource}`);
  }

  create(data) {
    return POST(this.resource, data);
  }

  //partial update
  update(id, updatedData) {
    return PATCH(`${this.resource}/${id}`, updatedData);
  }

  customUpdate(id, action, updatedData) {
    return PATCH(`${this.resource}/${id}/${action}`, updatedData);
  }

  delete(id) {
    return DELETE(`${this.resource}/${id}`);
  }
}
