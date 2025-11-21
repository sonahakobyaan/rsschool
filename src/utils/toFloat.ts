export const toFloat = (val: string | number | null | undefined): number => {
  if (val === null || val === undefined) return 0;
  return typeof val === "string" ? parseFloat(val) || 0 : val;
};