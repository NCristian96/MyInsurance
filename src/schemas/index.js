import * as yup from "yup";

const passwordRegex = /^(?=(.*[a-zA-Z]){2})(?=(.*\d){2})(?=.*[^a-zA-Z\d]).+$/;
export const registerSchema = yup.object().shape({
  email: yup.string().email("Please enter a valid email.").required("Required field."),
  password: yup
    .string()
    .min(6, "Password must have at least 6 characters.")
    .matches(passwordRegex, { message: "Password must contain at least:2 letters, 2 digits, 1 special character." })
    .required("Required field.")
});

export const policySchema = yup.object().shape({
  firstName: yup.string().max(10, "Max 10 characters allowed."),
  lastName: yup.string().required("This field is required.").min(3, "Name must contain at least 3 characters."),
  birthDate: yup.date().required("This field is required."),
  policyType: yup.string().oneOf(["RCA", "CASCO"]).required("This field is required."),
  carMake: yup.string().when("policyType", {
    is: value => value === "RCA",
    then: () => yup.string().required("This field is required.")
  }),
  manufacturingYear: yup.date().when("policyType", {
    is: value => value === "RCA",
    then: () => yup.date().required("This field is required.")
  }),
  registrationNumber: yup.string().when("policyType", {
    is: value => value === "RCA",
    then: () => yup.string().required("This field is required.")
  }),
  VIN: yup.string().when("policyType", {
    is: value => value === "CASCO",
    then: () => yup.string().required("This field is required.")
  }),
  kilometers: yup.number().when("policyType", {
    is: value => value === "CASCO",
    then: () => yup.number().required("This field is required.")
  })
});
