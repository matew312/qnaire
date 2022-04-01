// export const SelectableType = {
//   QUESTIONNAIRE: "questionnaire",
//   SECTION: "section",
//   QUESTION: "question",
// };

export class ComponentId {
  constructor(component, id) {
    this.component = component;
    this.id = id;
  }

  isEqual(component, id) {
    return component === this.component && id === this.id;
  }
}
