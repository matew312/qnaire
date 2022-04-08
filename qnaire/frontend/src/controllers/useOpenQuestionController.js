import { useQuestionController } from "./useQuestionController";

export function useOpenQuestionController(id) {
  const questionController = useQuestionController(id);
  return { ...questionController };
}
