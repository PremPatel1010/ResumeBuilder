import { validationResult } from "express-validator";

/** Standardize `{ message }` errors for the Axios client */
export function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const first = errors.array({ onlyFirstError: true })[0];
    return res.status(400).json({ message: first?.msg ?? "Validation failed" });
  }
  next();
}
