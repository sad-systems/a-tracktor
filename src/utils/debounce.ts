/**
 * @mergeModuleWith utils
 * @packageDocumentation
 */
type Timeout = ReturnType<typeof setTimeout>;

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds
 * have elapsed since the last time the debounced function was invoked.
 *
 * @param func  Function to call.
 * @param delay Delay in milliseconds.
 */
export function debounce(func: Function, delay: number) {
  let timeoutId: Timeout;

  return function (...args: any) {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}
