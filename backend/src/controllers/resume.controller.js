import { catchAsync } from "../utils/catchAsync.js";
import * as resumeService from "../services/resume.service.js";
import { streamResumePdf } from "../services/pdf.service.js";

export const listMine = catchAsync(async (req, res) => {
  const list = await resumeService.listResumesForUser(req.user.id);
  res.json(list);
});

export const getOne = catchAsync(async (req, res) => {
  const doc = await resumeService.getResumeForUser(req.user.id, req.params.id);
  res.json(doc);
});

export const createOne = catchAsync(async (req, res) => {
  const doc = await resumeService.createResume(req.user.id, req.body);
  res.status(201).json(doc);
});

export const updateOne = catchAsync(async (req, res) => {
  const doc = await resumeService.updateResumeForUser(req.user.id, req.params.id, req.body);
  res.json(doc);
});

export const removeOne = catchAsync(async (req, res) => {
  await resumeService.deleteResume(req.user.id, req.params.id);
  res.json({ success: true });
});

export const downloadPdf = catchAsync(async (req, res) => {
  const doc = await resumeService.getResumeDocForPdf(req.user.id, req.params.id);
  streamResumePdf(doc, res);
});
