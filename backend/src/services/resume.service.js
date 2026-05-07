import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { Resume } from "../models/Resume.model.js";

/** @typedef {import("mongoose").Types.ObjectId} ObjectId */

const FORBIDDEN_ROOT_KEYS = new Set(["user", "__v"]);

function sanitizeResumePayload(payload) {
  if (!payload || typeof payload !== "object") return {};
  const cleaned = JSON.parse(JSON.stringify(payload));
  delete cleaned._id;
  delete cleaned.__v;
  delete cleaned.createdAt;
  delete cleaned.updatedAt;
  delete cleaned.user;
  for (const k of FORBIDDEN_ROOT_KEYS) delete cleaned[k];
  return cleaned;
}

function stringifyResumeId(doc) {
  const o =
    typeof doc.toObject === "function"
      ? doc.toObject({ versionKey: false })
      : { ...doc };
  delete o.user;
  if (o._id) o._id = String(o._id);
  return o;
}

/** @param {ObjectId|string} userId */
export async function listResumesForUser(userId) {
  const list = await Resume.find({ user: userId }).sort({ updatedAt: -1 }).lean();
  return list.map((r) => stringifyResumeId(r));
}

/** @param {ObjectId|string} userId */
export async function getResumeForUser(userId, resumeId) {
  if (!mongoose.isValidObjectId(resumeId)) throw new ApiError(400, "Invalid resume id");
  const doc = await Resume.findOne({ _id: resumeId, user: userId }).lean();
  if (!doc) throw new ApiError(404, "Resume not found");
  return stringifyResumeId(doc);
}

/** @param {ObjectId|string} userId */
export async function createResume(userId, payload) {
  const data = sanitizeResumePayload(payload);
  const doc = await Resume.create({
    ...data,
    user: userId,
  });
  return stringifyResumeId(doc);
}

/** @param {ObjectId|string} userId */
export async function updateResumeForUser(userId, resumeId, payload) {
  if (!mongoose.isValidObjectId(resumeId)) throw new ApiError(400, "Invalid resume id");
  const data = sanitizeResumePayload(payload);

  const doc = await Resume.findOneAndUpdate({ _id: resumeId, user: userId }, data, {
    new: true,
    runValidators: true,
    overwrite: false,
  });
  if (!doc) throw new ApiError(404, "Resume not found");
  return stringifyResumeId(doc);
}

/** @param {ObjectId|string} userId */
export async function deleteResume(userId, resumeId) {
  if (!mongoose.isValidObjectId(resumeId)) throw new ApiError(400, "Invalid resume id");
  const res = await Resume.deleteOne({ _id: resumeId, user: userId });
  if (res.deletedCount === 0) throw new ApiError(404, "Resume not found");
  return true;
}

export async function getResumeDocForPdf(userId, resumeId) {
  if (!mongoose.isValidObjectId(resumeId)) throw new ApiError(400, "Invalid resume id");
  const doc = await Resume.findOne({ _id: resumeId, user: userId }).lean();
  if (!doc) throw new ApiError(404, "Resume not found");
  return doc;
}
