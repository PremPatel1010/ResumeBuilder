import { body } from "express-validator";

export const aiSummaryValidators = [
  body("role").optional({ nullable: true }).isString().isLength({ max: 200 }),
  body("experience").optional({ nullable: true }).isString().isLength({ max: 4000 }),
  body("keywords")
    .optional({ nullable: true })
    .isArray({ max: 40 })
    .withMessage("keywords must be an array"),
  body("keywords.*").optional().isString().isLength({ max: 80 }),
];

export const aiSkillsValidators = [
  body("role").optional({ nullable: true }).isString().isLength({ max: 200 }),
  body("experience").optional({ nullable: true }).isString().isLength({ max: 4000 }),
];

export const aiProjectsValidators = [
  body("name").optional({ nullable: true }).isString().isLength({ max: 200 }),
  body("tech").optional({ nullable: true }).isString().isLength({ max: 200 }),
  body("description").optional({ nullable: true }).isString().isLength({ max: 8000 }),
];
