import validator from "validator";

export const validateEmail = (email: string): boolean => {
  return validator.isEmail(email);
};

export const validatePassword = (password: string): boolean => {
  // At least 8 characters, at least one letter and one number
  return (
    validator.isLength(password, { min: 8 }) &&
    validator.matches(password, /[a-zA-Z]/) &&
    validator.matches(password, /[0-9]/)
  );
};
