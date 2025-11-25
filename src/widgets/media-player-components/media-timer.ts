/**
 * @mergeModuleWith media-player-components
 * @packageDocumentation
 */
import { mediaTimeToString } from '../../utils/media-time';

/**
 * MediaTimer type.
 */
export enum MediaTimerType {
  /** Time elapsed. */
  ELAPSED = 'elapsed',
  /** Remaining time. */
  REMAINING = 'remaining',
  /** Total duration. */
  DURATION = 'duration',
}

/**
 * Interface for MediaTimer options.
 */
export interface IMediaTimerOptions {
  /** MediaTimer type. */
  type?: MediaTimerType;
  /**
   * Optional pointer element bind with {@link media-player-components.MediaTimePointer} instance
   * to follow its pointer.
   */
  pointerElement?: HTMLElement;
}

/**
 * Component to display current time position in human readable representation (suh as '00:00' or '00:00:00').
 */
export class MediaTimer {
  protected onTimeUpdate: (ev: Event) => void;
  protected onPointerMove: (ev: CustomEvent) => void;
  protected type: MediaTimerType = MediaTimerType.ELAPSED;
  protected pointerElement?: HTMLElement;

  /**
   * Constructor
   *
   * @param mediaElement Input HTML element with source media (audio|video).
   * @param viewElement  The HTML container for timer.
   * @param options      Option params.
   */
  constructor(
    protected mediaElement: HTMLMediaElement,
    protected viewElement: HTMLElement,
    protected options?: IMediaTimerOptions,
  ) {
    this.init(options);
  }

  /**
   * Removes all event listeners.
   */
  destroy() {
    this.mediaElement.removeEventListener('timeupdate', this.onTimeUpdate);
    if (this.pointerElement) {
      this.pointerElement.removeEventListener('pointer-move', this.onPointerMove);
    }
  }

  protected init(options?: IMediaTimerOptions) {
    this.setOptions(options);
    this.displayTime();

    this.onTimeUpdate = () => this.displayTime();

    if (this.type !== MediaTimerType.DURATION) {
      this.mediaElement.addEventListener('timeupdate', this.onTimeUpdate);
    } else if (!this.mediaElement.duration) {
      this.mediaElement.addEventListener('timeupdate', this.onTimeUpdate, { once: true });
    }

    // Display time by pointerElement event.
    if (this.pointerElement) {
      this.onPointerMove = (event) => this.displayTime(event?.detail?.offsetPercent);
      this.pointerElement.addEventListener('pointer-move', this.onPointerMove);
    }
  }

  protected setOptions(options?: IMediaTimerOptions) {
    this.type = options?.type ?? this.type;
    this.pointerElement = options?.pointerElement;
  }

  protected displayTime(externalValuePercent?: number) {
    let currentTime = this.mediaElement.currentTime;
    let value;

    // Sync with external value.
    if (typeof externalValuePercent === 'number') {
      currentTime = this.mediaElement.duration * externalValuePercent;
    }

    switch (this.type) {
      case MediaTimerType.ELAPSED:
        value = currentTime;
        break;
      case MediaTimerType.REMAINING:
        value = this.mediaElement.duration - currentTime;
        break;
      default:
        value = this.mediaElement.duration;
    }

    this.viewElement.innerText = mediaTimeToString(value, this.mediaElement.duration);
  }
}
