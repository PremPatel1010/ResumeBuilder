import { verifyToken } from "../utils/jwt.utils.js";
import { catchAsync } from "../utils/catchAsync.js";

export const protect = catchAsync(async (req, res, next) => {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token?.trim())
    return res.status(401).json({ message: "Not authorized" });

  const { userId } = verifyToken(token.trim());
  req.user = { id: userId };
  next();
});
