import { catchAsync } from "../utils/catchAsync.js";
import * as authService from "../services/auth.service.js";

export const register = catchAsync(async (req, res) => {
  const result = await authService.registerUser(req.body);
  res.status(201).json(result);
});

export const login = catchAsync(async (req, res) => {
  const result = await authService.loginUser(req.body);
  res.json(result);
});

export const me = catchAsync(async (req, res) => {
  const user = await authService.getUserById(req.user.id);
  res.json(user);
});

export const updateMe = catchAsync(async (req, res) => {
  const user = await authService.updateUser(req.user.id, req.body);
  res.json(user);
});

export const deleteMe = catchAsync(async (req, res) => {
  await authService.deleteUser(req.user.id);
  res.status(204).send();
});
