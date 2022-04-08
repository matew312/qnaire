import { useQuestionController } from "./useQuestionController";

export function useRangeQuestionController(id) {
  const questionController = useQuestionController(id);
  return { ...questionController };
}
