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
 * Returns the vendor prefix for function and event of entering fullscreen mode (cross-browser).
 *
 * @param el HTML element.
 */
export function getRequestFullscreenPrefix(el: HTMLElement): string {
  if (el.requestFullscreen) {
    // All modern browsers.
    return '';
  } else if ((el as any).webkitRequestFullscreen) {
    // Safari / old Chrome
    return 'webkit';
  } else if ((el as any).mozRequestFullScreen) {
    // Old Firefox
    return 'moz';
  } else if ((el as any).msRequestFullscreen) {
    // Old IE/Edge
    return 'ms';
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

let onFullscreenchange: any = null;

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
  const eventFullscreenchange = getRequestFullscreenPrefix(el) + 'fullscreenchange';

  // Checks if we are already in full-screen mode.
  if (!getFullscreenElement()) {
    // If NO — entering the fullscreen mode.
    const requestFullscreen = getRequestFullscreenFunction(el);

    if (requestFullscreen) {
      void requestFullscreen
        .bind(el)(options)
        .then(() => {
          // Remove last handler on exit from full-screen mode without pressing a button.
          document.removeEventListener(eventFullscreenchange, onFullscreenchange);
          // Add a new handler on exit from full-screen mode without pressing a button.
          onFullscreenchange = () => !getFullscreenElement() && onExit && onExit(); // Run a callback function when exiting full-screen mode.
          document.addEventListener(eventFullscreenchange, onFullscreenchange);
          onEnter && onEnter();
        })
        .catch((e: Error) => onError && onError(e));
    } else {
      onError && onError(new Error('Unsupported requestFullscreen function'));
    }
  } else {
    // If YES — exiting the full-screen mode.
    const exitFullscreen = getExitFullscreenFunction();

    if (exitFullscreen) {
      // Remove last handler on exit from full-screen mode without pressing a button.
      document.removeEventListener(eventFullscreenchange, onFullscreenchange);
      // Run a callback function when exiting full-screen mode.
      void exitFullscreen
        .bind(document)()
        .then(() => onExit && onExit())
        .catch((e: Error) => onError && onError(e));
    } else {
      onError && onError(new Error('Unsupported exitFullscreen function'));
    }
  }
}
