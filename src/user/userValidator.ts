import validationSchema from "../../utils/validateSchema";

// ADD SUPPLIER VALIDATION:
export const addDemoValidation = [
  ...validationSchema.body.requiredText([
    "requiredText1",
    "requiredText2",
    "nestedObj.requiredText3",
  ]),
  ...validationSchema.body.text([
    "optionText1",
    "optionalText2",
    "nestedObject.optionalText3",
  ]),
  ...validationSchema.body.number(["businessContactPerson.phoneNo"]),
  ...validationSchema.body.array([
    "bidEmails",
    "projectsEmail",
    "accountsEmail",
  ]),
];
