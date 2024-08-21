import validationSchema from "../../utils/validateSchema";
import validationErrorHandler from "../middlewares/validationErrorHandler";

export const addUserValidation=[
    ...validationSchema?.body?.requiredText(['name','email','password']),
    validationErrorHandler
]

export const getUserUpdateByIdValidation = [
    ...validationSchema?.param?.mongooseId(['id']),
    validationErrorHandler
  ];