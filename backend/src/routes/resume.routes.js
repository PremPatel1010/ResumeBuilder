import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import * as ctrl from "../controllers/resume.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  resumeIdParam,
  resumeCreateValidators,
  resumeUpdateValidators,
} from "../validators/resume.validators.js";

const router = Router();

router.use(protect);

router.get("/", ctrl.listMine);

router.get("/:id/pdf", resumeIdParam, validate, ctrl.downloadPdf);

router.get("/:id", resumeIdParam, validate, ctrl.getOne);

router.post("/", resumeCreateValidators, validate, ctrl.createOne);

router.put("/:id", [...resumeIdParam, ...resumeUpdateValidators], validate, ctrl.updateOne);

router.delete("/:id", resumeIdParam, validate, ctrl.removeOne);

export default router;
