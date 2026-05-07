import { Router } from "express";
import * as ctrl from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { protect } from "../middleware/auth.middleware.js";
import * as validators from "../validators/auth.validators.js";

const router = Router();

router.post("/register", validators.registerValidators, validate, ctrl.register);
router.post("/login", validators.loginValidators, validate, ctrl.login);
router.get("/me", protect, ctrl.me);
router.patch("/me", protect, validators.updateProfileValidators, validate, ctrl.updateMe);
router.delete("/me", protect, ctrl.deleteMe);

export default router;
