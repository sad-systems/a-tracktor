/**
 * @mergeModuleWith utils
 * @packageDocumentation
 */
/**
 * Returns the current fullscreen element (cross-browser).
 */
export function getFullscreenElement(): Element | undefined {
  return (
    document.fullscreenElement ||
    (document as any).webkitFullscreenElement ||
    (document as any).mozFullScreenElement ||
    (document as any).msFullscreenElement ||
    undefined
  );
}

/**
 * Returns the cross-browser function of entering fullscreen mode.
 *
 * @param el HTML element.
 */
export function getRequestFullscreenFunction(
  el: HTMLElement,
): (options?: FullscreenOptions) => Promise<void> | undefined {
  if (el.requestFullscreen) {
    return el.requestFullscreen;
  } else if ((el as any).webkitRequestFullscreen) {
    // Safari / old Chrome
    return (el as any).webkitRequestFullscreen;
  } else if ((el as any).mozRequestFullScreen) {
    // Old Firefox
    return (el as any).mozRequestFullScreen;
  } else if ((el as any).msRequestFullscreen) {
    // Old IE/Edge
    return (el as any).msRequestFullscreen;
  }
}

/**
 * Returns the cross-browser function for exiting full-screen mode.
 */
export function getExitFullscreenFunction(): () => Promise<void> | undefined {
  if (document.exitFullscreen) {
    return document.exitFullscreen;
  } else if ((document as any).webkitExitFullscreen) {
    return (document as any).webkitExitFullscreen;
  } else if ((document as any).mozCancelFullScreen) {
    return (document as any).mozCancelFullScreen;
  } else if ((document as any).msExitFullscreen) {
    return (document as any).msExitFullscreen;
  }
}

/**
 * Toggles the given element to full screen mode.
 *
 * @param el      The given element.
 * @param options Full screen options.
 * @param onEnter Callback on entering fullscreen mode.
 * @param onExit  Callback on exiting from fullscreen mode.
 * @param onError Callback on error.
 */
export function toggleFullScreen(
  el: HTMLElement,
  options?: FullscreenOptions,
  onEnter?: () => void,
  onExit?: () => void,
  onError?: (e: Error) => void,
) {
  // Checks if we are already in full-screen mode.
  if (!getFullscreenElement()) {
    // If NO — entering the fullscreen mode.
    const requestFullscreen = getRequestFullscreenFunction(el);

    if (requestFullscreen) {
      void requestFullscreen
        .bind(el)(options)
        .then(() => onEnter && onEnter())
        .catch((e: Error) => onError && onError(e));
    } else {
      onError && onError(new Error('Unsupported requestFullscreen function'));
    }
  } else {
    // If YES — exiting the full-screen mode.
    const exitFullscreen = getExitFullscreenFunction();

    if (exitFullscreen) {
      void exitFullscreen
        .bind(document)()
        .then(() => onExit && onExit())
        .catch((e: Error) => onError && onError(e));
    } else {
      onError && onError(new Error('Unsupported exitFullscreen function'));
    }
  }
}
