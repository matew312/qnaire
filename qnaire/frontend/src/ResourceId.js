// export const SelectableType = {
//   QUESTIONNAIRE: "questionnaire",
//   SECTION: "section",
//   QUESTION: "question",
// };

export class ResourceId {
  constructor(resource, id) {
    this.resource = resource;
    this.id = id;
  }

  isEqual(resource, id) {
    return resource === this.resource && id === this.id;
  }
}
