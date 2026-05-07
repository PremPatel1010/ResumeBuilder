/** Format user for frontend (matches useAuthStore AuthUser shape). */
export function toPublicUser(doc) {
  if (!doc) return null;
  const o = typeof doc.toObject === "function" ? doc.toObject() : doc;
  const id = String(o._id);
  const { password, ...rest } = o;
  return {
    id,
    _id: id,
    name: rest.name,
    email: rest.email,
    ...(rest.avatar != null ? { avatar: rest.avatar } : {}),
  };
}
