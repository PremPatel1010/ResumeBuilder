import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import * as ctrl from "../controllers/ai.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  aiSummaryValidators,
  aiSkillsValidators,
  aiProjectsValidators,
} from "../validators/ai.validators.js";

const router = Router();

router.use(protect);

router.post("/summary", aiSummaryValidators, validate, ctrl.summary);
router.post("/skills", aiSkillsValidators, validate, ctrl.skills);
router.post("/projects", aiProjectsValidators, validate, ctrl.projects);

export default router;
