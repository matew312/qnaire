import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import qnaireSource from "../data/QnaireSource";
import { useBaseQnaireController } from "./useBaseQnaireController";
import * as yup from "yup";
import { number, yupErrorToFieldErrors } from "../validation";
import OpenAnswer from "../components/response-page/OpenAnswer";
import RangeAnswer from "../components/response-page/RangeAnswer";
import MultipleChoiceAnswer from "../components/response-page/MultipleChoiceAnswer";

const requiredIfMandatory = (q, schema) =>
  q.mandatory ? schema.required("Odpověd na tuto otázku je povinná") : schema;

const createOpenAnswerSchema = (q) => {
  let schema = yup.string().default("");
  schema = requiredIfMandatory(q, schema);
  //it seems to work correctly even if I pass null to the method, but I didn't see any mention of it in docs
  if (q.min_length !== null) {
    schema = schema.min(q.min_length);
  }
  if (q.max_length !== null) {
    schema = schema.max(q.max_length);
  }
  return schema;
};

const createRangeAnswerSchema = (q) => {
  let schema = number.default(null).min(q.min).max(q.max);
  schema = requiredIfMandatory(q, schema);
  if (q.step !== null) {
    schema = schema.test(
      "step-of",
      `Hodnota musí být rovno ${q.min} + k * ${q.step}, kde k je přirozené číslo`,
      (value, context) => (value - q.min) % q.step === 0
    );
  }
  return schema;
};

const createMultipleChoiceAnswerSchema = (q) => {
  let choicesSchema = yup
    .array()
    // .ensure() //there would have to be custom test if I used this (number of choices would need to be within min and max if mandatory or if array not empty )
    .nullable()
    .default(null)
    .min(q.min_answers, "Musí být vybráno alespoň ${min} odpovědí");
  if (q.max_answers) {
    choicesSchema = choicesSchema.max(
      q.max_answers,
      "Musí být vybráno nanejvýše ${max} odpovědí"
    );
  }
  let otherChoiceSchema = yup.string().default("");
  if (q.mandatory && q.min_answers > 0) {
    choicesSchema = choicesSchema.when(
      "other_choice_text",
      (other_choice_text, schema) =>
        !other_choice_text
          ? schema.required(
              `Musí být vybráno alespoň ${q.min_answers} odpovědí`
            )
          : schema
    );
  }
  let schema = yup.object({
    choices: choicesSchema,
    other_choice_text: otherChoiceSchema,
  });

  return schema;
};

// try {
//   const s = createMultipleChoiceAnswerSchema({
//     mandatory: true,
//     min_answers: 1,
//   });
//   console.log(s.validateSync({ choices: null }));
// } catch (error) {
//   console.log(error);
// }

export const QuestionAnswerMap = {
  OpenQuestion: {
    component: OpenAnswer,
    createSchema: createOpenAnswerSchema,
  },
  RangeQuestion: {
    component: RangeAnswer,
    createSchema: createRangeAnswerSchema,
  },
  MultipleChoiceQuestion: {
    component: MultipleChoiceAnswer,
    createSchema: createMultipleChoiceAnswerSchema,
  },
};

export function useQnaireResponseController(id, privateId, isPreview) {
  const { data, update, ...baseQnaireController } = useBaseQnaireController(id);
  const [sections, setSections] = useState(null);
  const [pageMap, setPageMap] = useState(null); //contains all needed data for each section (other than the section)
  const [sectionIdxStack, setSectionIdxStack] = useState([]);
  const [isDone, setIsDone] = useState(false); // if the response was successfully submited
  const skipToSectionId = useRef(null);

  useEffect(() => {
    qnaireSource.setShouldAuth(false);
    qnaireSource.retrieve(id).then((data) => {
      update(data, false); //passed shouldSourceUpdate=false to prevent unnecessary api call
      const sectionSource = qnaireSource.sectionSource;
      const sections = sectionSource.getSortedSections();

      const pageMap = sections.reduce((pageMap, section) => {
        const questions = qnaireSource.questionSource.getQuestionsForSection(
          section.id
        );
        let answers = {};
        const schemaObj = {};
        const errors = {};
        questions.forEach((q) => {
          schemaObj[q.id] = QuestionAnswerMap[q.resourcetype].createSchema(q);
        });
        const validationSchema = yup.object(schemaObj);
        answers = validationSchema.cast(answers);

        pageMap[section.id] = { questions, answers, validationSchema, errors };
        return pageMap;
      }, {});

      setSections(sections);
      setPageMap(pageMap);
    });
  }, [id]);

  let currentSectionIdx = null;
  let currentSection = null;
  let isIntro = true;
  let isLastSection = false;
  let totalSections = null;
  let currentPage = null;
  // let isFirstSection = false;
  if (sections && pageMap && sectionIdxStack.length > 0) {
    currentSectionIdx = sectionIdxStack[sectionIdxStack.length - 1];
    currentSection = sections[currentSectionIdx];
    totalSections = sections.length;
    isIntro = false;
    isLastSection = currentSectionIdx === sections.length - 1;
    // isFirstSection = currentSectionIdx === 0;
    currentPage = pageMap[currentSection.id];
  }

  const setAnswer = useCallback((question, value) => {
    setPageMap((pageMap) => {
      return {
        ...pageMap,
        [question.section]: {
          ...pageMap[question.section],
          answers: {
            ...pageMap[question.section].answers,
            [question.id]: value,
          },
        },
      };
    });
  }, []);

  const setError = useCallback(
    (errors) => {
      setPageMap((pageMap) => {
        return {
          ...pageMap,
          [currentSection.id]: {
            ...pageMap[currentSection.id],
            errors,
          },
        };
      });
    },
    [currentSection]
  );

  const setSkipToSectionId = useCallback(
    (id) => (skipToSectionId.current = id),
    []
  );

  const validate = () => {
    try {
      currentPage.validationSchema.validateSync(currentPage.answers, {
        abortEarly: false,
      });
      setError({});
      return true;
    } catch (error) {
      console.log(error.inner);
      setError(yupErrorToFieldErrors(error));
      return false;
    }
  };

  const submitResponse = () => {
    if (!validate()) {
      return;
    }

    if (isPreview) {
      setIsDone(true);
      return;
    }

    //if data.published then error

    // qnaireSource.createResponse
  };

  const goToNextSection = () => {
    if (!isIntro && !validate()) {
      return;
    }

    if (!skipToSectionId.current) {
      setSectionIdxStack((sectionIdxStack) => {
        if (sectionIdxStack.length > 0) {
          const nextSectionIdx =
            sectionIdxStack[sectionIdxStack.length - 1] + 1;
          return [...sectionIdxStack, nextSectionIdx];
        } else {
          return [0];
        }
      });
    } else {
      setSectionIdxStack((sectionIdxStack) => [
        ...sectionIdxStack,
        sections.findIndex((section) => section.id === skipToSectionId.current),
      ]);
    }
  };

  const goToPreviousSection = () => {
    setSectionIdxStack((sectionIdxStack) => {
      const newSectionIdxStack = Array.from(sectionIdxStack);
      newSectionIdxStack.pop();
      return newSectionIdxStack;
    });
  };

  return {
    ...baseQnaireController,
    isLoaded: Boolean(data.id) && Boolean(sections),
    qnaire: data,
    currentSection,
    ...currentPage,
    totalSections,
    isLastSection,
    // isFirstSection,
    isIntro,
    isDone,
    goToNextSection,
    goToPreviousSection,
    submitResponse,
    setSkipToSectionId,
    setAnswer,
  };
}
