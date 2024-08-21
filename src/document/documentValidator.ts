import validationSchema from "../../utils/validateSchema";
import validationErrorHandler from "../middlewares/validationErrorHandler";

export const addDocumentValidation = [
  ...validationSchema?.body?.requiredText(["documentName","description","catergory"]),
  validationErrorHandler
];

export const getDocumentByIdValidation = [
  ...validationSchema?.param?.mongooseId(['id']),
  validationErrorHandler
];

export const deleteDocumentValidation = [
  ...validationSchema?.param?.mongooseId(['id']),
  validationErrorHandler
];

export const updateDocumentValidation = [
  ...validationSchema?.param?.mongooseId(['id']),
  validationErrorHandler
];
