export const uuid = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  const fallback = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  return `${fallback()}${fallback()}-${fallback()}-${fallback()}-${fallback()}-${fallback()}${fallback()}${fallback()}`;
};
