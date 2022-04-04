import {
  dictToArraySortedByOrderNum,
  findMaxOrderNum,
  sortArrayByOrderNum,
} from "../qnaireUtils";
import { Resources } from "../Resources";
import { GET, PATCH, POST, DELETE } from "../request";
import { DISPLAY_TYPES } from "../components/RangeQuestionOptions";

const ANY_ID = "ANY_ID";
const UPDATE_TIMEOUT = 750;

export class QnaireSource {
  constructor({ questions, sections, choices, ...data }) {
    this.id = data.id;
    this.questionnaires = [];
    this.questionnaires[this.id] = data;
    this.sections = sections;
    this.questions = questions;
    this.choices = choices;

    this.newObj = null;
    this.selected = null;

    this.subscribers = {};
    Object.keys(Resources).forEach(
      (key) => (this.subscribers[Resources[key]] = {})
    );
    console.log(this.subscribers);
    this.updateTimeout = null;
  }

  _get(resource, id) {
    return this[resource][id];
  }

  getQnaire() {
    return this._get(Resources.QNAIRES, this.id);
  }

  getSection(id) {
    return this._get(Resources.SECTIONS, id);
  }

  getQuestion(id) {
    return this._get(Resources.QUESTIONS, id);
  }

  getChoice(id) {
    return this._get(Resources.CHOICES, id);
  }

  getChoicesForQuestion(id) {
    return Object.keys(this.choices).reduce((filtered, choiceId) => {
      if (this.choices[choiceId].question === id) {
        filtered.push(this.choices[choiceId]);
      }
      return filtered;
    }, []);
  }

  getSections() {
    return dictToArraySortedByOrderNum(this.sections);
  }

  getQuestionsForSection(id) {
    const filtered = Object.keys(this.questions).reduce((filtered, qId) => {
      if (this.questions[qId].section === id) {
        filtered.push(this.questions[qId]);
      }
      return filtered;
    }, []);
    const sorted = sortArrayByOrderNum(filtered);
    return sorted;
  }

  getSection(id) {
    return this._get(Resources.SECTIONS, id);
  }

  _subscribe(resource, id, callback) {
    const subs = this.subscribers[resource];
    if (subs[id] === undefined) {
      subs[id] = [];
    }
    subs[id].push(callback);

    if (
      this.newObj &&
      this.newObj.id === id &&
      this.newObj.resource === resource
    ) {
      this.select(resource, id, callback);
      callback();
      this.newObj = null;
    }
  }

  _unsubscribe(resource, id, callback) {
    const subs = this.subscribers[resource];
    if (subs[id] !== undefined) {
      subs[id] = subs[id].filter(function (sub) {
        return sub !== callback;
      });
    }
  }

  _notify(resource, id) {
    const subs = this.subscribers[resource];
    if (subs[id] !== undefined) {
      subs[id].forEach((sub) => sub());
    }
    if (subs[ANY_ID] !== undefined) {
      subs[ANY_ID].forEach((sub) => sub());
    }
  }

  subscribeQnaire(callback) {
    this._subscribe(Resources.QNAIRES, this.id, callback);
  }

  subscribeSections(callback) {
    this._subscribe(Resources.SECTIONS, ANY_ID, callback);
  }

  subscribeSection(id, callback) {
    this._subscribe(Resources.SECTIONS, id, callback);
  }

  subscribeQuestion(id, callback) {
    this._subscribe(Resources.QUESTIONS, id, callback);
  }

  subscribeChoice(id, callback) {
    this._subscribe(Resources.CHOICES, id, callback);
  }

  unsubscribeQnaire(callback) {
    this._unsubscribe(Resources.QNAIRES, this.id, callback);
  }

  unsubscribeSections(callback) {
    this._unsubscribe(Resources.SECTIONS, ANY_ID, callback);
  }

  unsubscribeSection(id, callback) {
    this._unsubscribe(Resources.SECTIONS, id, callback);
  }

  unsubscribeQuestion(id, callback) {
    this._unsubscribe(Resources.QUESTIONS, id, callback);
  }

  unsubscribeChoice(id, callback) {
    this._unsubscribe(Resources.CHOICES, id, callback);
  }

  select(resource, id, onUnselect) {
    this.updateTimeout = null; //prevent cancel of the update to the previous selected component

    if (this.selected) {
      this.selected.onUnselect();
    }
    this.selected = { resource, id, onUnselect };
  }

  isSelected(resource, id) {
    return (
      this.selected &&
      this.selected.resource === resource &&
      this.selected.id === id
    );
  }

  _setData(resource, id, data) {
    this[resource][id] = data;
    this._notify(resource, id);
  }

  _updateData(resource, id, data) {
    this._setData(resource, id, { ...this[resource][id], ...data });
  }

  _update(resource, id, updatedData) {
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
    }

    this._updateData(resource, id, updatedData);

    this.updateTimeout = setTimeout(
      () =>
        PATCH(`${resource}/${id}`, updatedData)
          .then(() => this._updateData(resource, id, { error: "" }))
          .catch((data) => {
            this._updateData(resource, id, { error: JSON.stringify(data) });
          }),
      UPDATE_TIMEOUT
    );
  }

  updateQnaire(updatedData) {
    this._update(Resources.QNAIRES, this.id, updatedData);
  }

  updateSection(id, updatedData) {
    this._update(Resources.SECTIONS, id, updatedData);
  }

  updateQuestion(id, updatedData) {
    updatedData.resourcetype = this.questions[id].resourcetype;
    this._update(Resources.QUESTIONS, id, updatedData);
  }

  updateQuestionType(id, resourcetype) {
    const { section, text, mandatory, order_num } = this.getQuestion(id);
    let newQ = {
      id,
      section,
      text,
      mandatory,
      order_num,
      resourcetype,
    };
    switch (newQ.resourcetype) {
      case "OpenQuestion": {
        newQ = { ...newQ, min_length: null, max_length: null };
        break;
      }
      case "RangeQuestion": {
        newQ = { ...newQ, min: 1, max: 5, step: 1, type: DISPLAY_TYPES[1] };
        break;
      }
      case "MultipleChoiceQuestion": {
        newQ = {
          ...newQ,
          min_answers: 0,
          max_answers: 0,
          other_choice: false,
          random_order: false,
          choices: {},
        };
        break;
      }
    }
    //TOOD: call appropriate api calls ....

    this._setData(Resources.QUESTIONS, id, newQ);
  }

  updateChoice(id, updatedData) {
    this._update(Resources.CHOICES, id, updatedData);
  }

  createSection() {
    let order_num = 0;
    console.log(this);
    if (this.selected) {
      switch (this.selected.resource) {
        case Resources.QNAIRES:
          order_num = findMaxOrderNum(this.sections) + 1;
          break;
        case Resources.SECTIONS:
          order_num = this.selected.order_num + 1;
          break;
        case Resources.QUESTIONS:
          order_num = this.sections[this.selected.section].order_num + 1;
          break;
      }
    } else {
      order_num = findMaxOrderNum(this.sections) + 1;
    }
    const name = `Sekce ${order_num + 1}`;
    const data = { name, order_num };

    POST(Resources.SECTIONS, { ...data, qnaire: this.id }).then((data) => {
      this._setData(Resources.SECTIONS, data.id, data);
      this.newObj = { resource: Resources.SECTIONS, id: data.id };
      //section was added, so questionnaire has to be rerendered (though React.memo will be at work for other sections)
      this._notify(Resources.QNAIRES, this.id);
    });
  }

  createQuestion() {}
}
