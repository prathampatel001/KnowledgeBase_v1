import validationSchema from "../../utils/validateSchema"
import validationErrorHandler from "../middlewares/validationErrorHandler"



export const addPageValidation=[
    ...validationSchema?.body?.requiredText(["title","document","authorName","authorEmail",]),
    validationErrorHandler
   
  ]


  export const getPageByIdValidation = [
    ...validationSchema?.param?.mongooseId(['id']),
    validationErrorHandler
  ];

  export const deletePageValidation = [
    ...validationSchema?.param?.mongooseId(['id']),
    validationErrorHandler
  ]
  
  export const updatePageValidation = [
    ...validationSchema?.param?.mongooseId(['id']),
    validationErrorHandler
  ]