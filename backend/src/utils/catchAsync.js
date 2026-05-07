/** @typedef {(req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => void | Promise<void>} AsyncHandler */

/**
 * Wrap async route handlers; forward errors to `next(error)`.
 * @param {AsyncHandler} fn
 */
export function catchAsync(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
