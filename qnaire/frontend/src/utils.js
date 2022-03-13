

export function ensurePrecision(value, step) {
  const stepDecimalPart = step.toString().split(".")[1];
  const stepPrecision = stepDecimalPart ? stepDecimalPart.length : 0;

  const order = Math.pow(10, stepPrecision)
  return Math.round(value * order) / order;
  //return Number(value.toFixed(stepPrecision));
}
