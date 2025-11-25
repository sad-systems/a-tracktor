/**
 * @mergeModuleWith utils
 * @packageDocumentation
 */
/**
 * Restricts the input value by bounds.
 *
 * @param value Input value.
 * @param left Left bound.
 * @param right Right bound.
 */
export function bounds(value: number, left = 0, right = 1): number {
  return value > left ? (value < right ? value : right) : left;
}
