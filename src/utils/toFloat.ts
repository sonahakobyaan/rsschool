export const toFloat = (val: number | string | null | undefined) => {
  if (val === null || val === undefined) return 0;
  return typeof val === "string" ? parseFloat(val) || 0 : val;
};