import * as yup from "yup";

export function yupErrorToFieldErrors(yupError) {
  let errors = {};
  if (yupError.inner) {
    if (yupError.inner.length === 0) {
      errors[yupError.path] = yupError.message;
    } else {
      for (let err of yupError.inner) {
        errors[err.path] = err.message;
      }
    }
  }
  return errors;
}

yup.setLocale({
  mixed: {
    default: "Neplatný vstup",
    required: "Pole musí být vyplněno",
  },
  number: {
    typeError: "Hodnota musí být číslo",
    integer: "Hodnota musí být celé číslo",
    positive: "Hodnota musí být kladná",
    min: "Hodnota musí být větší nebo rovno ${min}",
    max: "Hodnota musí být menší nebo rovno ${max}",
    moreThan: "Hodnota musí být větší než ${moreThan}",
    lessThan: "Hodnota musí být menší než ${lessThan}",
  },
});

export const requiredString = yup.string().required();

export const number = yup.number().nullable();
export const requiredNumber = number.required();