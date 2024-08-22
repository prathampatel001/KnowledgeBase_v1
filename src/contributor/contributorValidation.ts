import validationSchema from "../../utils/validateSchema"
import validationErrorHandler from "../middlewares/validationErrorHandler"



export const addContributorValidation=[
    ...validationSchema?.body?.requiredText(["documentId","editAccess"]),
    validationErrorHandler
   
  ]


  export const getContributorByIdValidation = [
    ...validationSchema?.param?.mongooseId(['id']),
    validationErrorHandler
  ];

  export const deleteContributorValidation = [
    ...validationSchema?.param?.mongooseId(['id']),
    validationErrorHandler
  ]
  
  export const updateContributorValidation = [
    ...validationSchema?.param?.mongooseId(['id']),
    validationErrorHandler
  ]