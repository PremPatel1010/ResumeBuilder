import { body, check } from "express-validator";

export const registerValidators = [
  body("name").trim().notEmpty().withMessage("Name is required").isLength({ max: 120 }),
  body("email").trim().isEmail().withMessage("Valid email required").normalizeEmail(),
  body("password")
    .isString()
    .isLength({ min: 6, max: 128 })
    .withMessage("Password must be 6–128 characters"),
];

export const loginValidators = [
  body("email").trim().isEmail().withMessage("Valid email required").normalizeEmail(),
  body("password").isString().notEmpty().withMessage("Password is required"),
];

export const updateProfileValidators = [
  check().custom((_v, { req }) => {
    const keys = ["name", "email", "avatar"];
    const hasAny = keys.some((k) => req.body[k] !== undefined && req.body[k] !== "");
    if (!hasAny) throw new Error("Provide at least one of: name, email, avatar");
    return true;
  }),
  body("name").optional().trim().notEmpty().withMessage("Name cannot be empty").isLength({ max: 120 }),
  body("email").optional().trim().isEmail().withMessage("Valid email required").normalizeEmail(),
  body("avatar").optional().trim().isLength({ max: 2000 }),
];
