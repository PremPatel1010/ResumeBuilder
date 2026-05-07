import { body, param } from "express-validator";

const templateValues = ["modern", "classic", "compact", "elegant"];

export const resumeIdParam = [
  param("id").isMongoId().withMessage("Invalid resume id"),
];

export const resumeCreateValidators = [
  body("title").optional({ nullable: true }).isString().isLength({ max: 200 }),
  body("template").optional({ nullable: true }).isString().isIn(templateValues),
];

export const resumeUpdateValidators = [...resumeCreateValidators];
