import { useQuestionController } from "./useQuestionController";
import * as yup from "yup";
import { requiredNumber, number } from "../validation";

const TYPES = {
  ENUMERATE: 1,
  SLIDER: 2,
  FIELD: 3,
  STAR_RATING: 4,
  SMILEY_RATING: 5,
};

export const DISPLAY_TYPES = {
  1: "Výběr z možností",
  2: "Posuvník",
  3: "Vstupní pole",
  4: "Hvězdičkové hodnocení",
  5: "Smajlíkové hodnocení",
};

const MAX_SMILEYS = 5;

yup.addMethod(yup.number, "integerIfStep", function (args) {
  // const { path } = this;
  return this.when("step", (step, schema) =>
    step !== null
      ? schema.integer(`Hodnota musí být celé číslo, když je definován skok`)
      : schema
  );
});

yup.addMethod(yup.number, "equalTo1WhenSmiley", function (args) {
  // const { path } = this;
  return this.when("type", (type, schema) =>
    type === TYPES.SMILEY_RATING
      ? schema
          .min(
            1,
            `Hodnota musí být rovna 1, když je typ zobrazení ${DISPLAY_TYPES[type]}`
          )
          .max(
            1,
            `Hodnota musí být rovna 1, když je typ zobrazení ${DISPLAY_TYPES[type]}`
          )
      : schema
  );
});

const validationSchema = yup.object({
  min: requiredNumber.integerIfStep().equalTo1WhenSmiley(),
  max: requiredNumber
    .integerIfStep()
    .when("min", (min, schema) =>
      schema.moreThan(min, "Hodnota musí větší než min")
    )
    .when("type", (type, schema) =>
      type === TYPES.SMILEY_RATING
        ? schema.max(
            MAX_SMILEYS,
            `Hodnota musí být menší nebo rovna ${MAX_SMILEYS}, když je typ zobrazení ${DISPLAY_TYPES[type]}`
          )
        : schema
    ),
  step: number
    .integer()
    .positive()
    .when("type", (type, schema) => {
      switch (type) {
        case TYPES.ENUMERATE:
        case TYPES.STAR_RATING:
        case TYPES.SMILEY_RATING:
          return schema.required(
            `Hodnota musí být definována, když je typ zobrazení ${DISPLAY_TYPES[type]}`
          );
        default:
          return schema;
      }
    })
    .equalTo1WhenSmiley(),
});

export function useRangeQuestionController(id) {
  const questionController = useQuestionController(id, validationSchema);
  return { ...questionController };
}
