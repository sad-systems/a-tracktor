/**
 * @mergeModuleWith utils
 * @packageDocumentation
 */
/**
 * Returns a human-readable text representation of the media time specified in seconds.
 *
 * @param seconds    Time in seconds (usually from media element).
 * @param maxSeconds Optional max time in seconds to define final output representation: h:mm:ss or just mm:ss.
 */
export function mediaTimeToString(seconds: number = 0, maxSeconds: number = 0): string {
  seconds = Math.trunc(seconds || 0);
  maxSeconds = Math.trunc(seconds || 0);

  const zeroFill = (value: number): string => String(value).padStart(2, '0');
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  const hoursMax = !hours && Math.floor(maxSeconds / 3600);

  return (
    (hours || hoursMax ? `${zeroFill(hours)}:` : '') + `${zeroFill(minutes)}:${zeroFill(secs)}`
  );
}
