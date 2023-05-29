export const VALIDATION_RULES = {
  email: /\S+@\S+\.\S+/,
  password: /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}/,
  name: /[A-Za-z]+/,
  phone: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
};
