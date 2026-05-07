import { catchAsync } from "../utils/catchAsync.js";
import * as aiService from "../services/ai.service.js";

export const summary = catchAsync(async (req, res) => {
  const out = await aiService.summarizeProfile(req.body);
  res.json(out);
});

export const skills = catchAsync(async (req, res) => {
  const out = await aiService.suggestSkills(req.body);
  res.json(out);
});

export const projects = catchAsync(async (req, res) => {
  const out = await aiService.improveProjectText(req.body);
  res.json(out);
});
