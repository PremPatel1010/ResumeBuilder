import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { signToken } from "../utils/jwt.utils.js";
import { toPublicUser } from "../utils/userResponse.js";
import { User } from "../models/User.model.js";
import { Resume } from "../models/Resume.model.js";

const SALT_ROUNDS = 12;

async function hashPassword(pw) {
  return bcrypt.hash(pw, SALT_ROUNDS);
}

export async function registerUser({ name, email, password }) {
  const existing = await User.findOne({ email: email.trim().toLowerCase() }).lean();
  if (existing) throw new ApiError(409, "An account with this email already exists");
  const user = await User.create({
    name: name.trim(),
    email,
    password: await hashPassword(password),
  });
  const token = signToken(user._id);
  const publicUser = toPublicUser(user);
  return { user: publicUser, token };
}

export async function loginUser({ email, password }) {
  const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+password");
  if (!user) throw new ApiError(401, "Invalid email or password");
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new ApiError(401, "Invalid email or password");
  const token = signToken(user._id);
  user.password = undefined;
  return { user: toPublicUser(user), token };
}

export async function getUserById(userId) {
  if (!mongoose.isValidObjectId(userId)) throw new ApiError(400, "Invalid user id");
  const user = await User.findById(userId).lean();
  if (!user) throw new ApiError(404, "User not found");
  return toPublicUser(user);
}

export async function updateUser(userId, { name, email, avatar }) {
  if (!mongoose.isValidObjectId(userId)) throw new ApiError(400, "Invalid user id");

  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  if (typeof name === "string") user.name = name.trim();
  if (typeof avatar === "string") user.avatar = avatar.trim().slice(0, 2000);

  if (typeof email === "string" && email.trim().toLowerCase() !== user.email) {
    const next = email.trim().toLowerCase();
    const taken = await User.findOne({ email: next, _id: { $ne: userId } }).lean();
    if (taken) throw new ApiError(409, "Email is already in use");
    user.email = next;
  }

  await user.save();
  return toPublicUser(user);
}

export async function deleteUser(userId) {
  if (!mongoose.isValidObjectId(userId)) throw new ApiError(400, "Invalid user id");
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      await Resume.deleteMany({ user: userId }).session(session);
      const res = await User.deleteOne({ _id: userId }).session(session);
      if (res.deletedCount === 0) throw new ApiError(404, "User not found");
    });
  } finally {
    await session.endSession();
  }
}
