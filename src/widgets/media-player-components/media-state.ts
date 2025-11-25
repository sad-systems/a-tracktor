/**
 * @mergeModuleWith media-player-components
 * @packageDocumentation
 */

/**
 * Interface for MediaState options.
 */
export interface IMediaStateOptions {
  /** CSS class to add on media element is playing. */
  classPlay?: string;
  /** CSS class to add on media element is paused. */
  classPause?: string;
  /** CSS class to add on media element is ended. */
  classEnded?: string;
  /** CSS class to add on media element is in error state. */
  classError?: string;
  /**
   * Enable or disable action play/pause on click.
   *
   * `false` by default.
   */
  enableControl?: boolean;
  /**
   * Revert media position on ended.
   *
   * `false` by default.
   */
  revertOnEnded?: boolean;
}

/**
 * Component to control playing process of media source.
 *
 * It adds CSS classes (like `play`, `pause`, `ended`, `error`) to the
 * control (set as `viewElement`) depending on the state of `mediaElement`.
 *
 * Additionally it can listen to the 'click' event on `viewElement` and trigger `mediaElement`
 * state to `play` or `pause`.
 */
export class MediaState {
  protected classPlay = 'play';
  protected classPause = 'pause';
  protected classEnded = 'ended';
  protected classError = 'error';
  protected enableControl = false;
  protected revertOnEnded = false;
  protected onPlay: (this: HTMLMediaElement, ev: Event) => void;
  protected onPause: (this: HTMLMediaElement, ev: Event) => void;
  protected onEnded: (this: HTMLMediaElement, ev: Event) => void;
  protected onError: (ev: Event) => void;
  protected onClick: (this: HTMLMediaElement, ev: Event) => void;

  /**
   * Constructor
   *
   * @param mediaElement Input HTML element with source media (audio|video).
   * @param viewElement  The HTML container to control.
   * @param options      Option params.
   */
  constructor(
    protected mediaElement: HTMLMediaElement,
    protected viewElement: HTMLElement,
    protected options?: IMediaStateOptions,
  ) {
    this.init(options);
  }

  /**
   * Removes all their own event listeners.
   */
  destroy() {
    this.mediaElement.removeEventListener('play', this.onPlay);
    this.mediaElement.removeEventListener('pause', this.onPause);
    this.mediaElement.removeEventListener('ended', this.onEnded);
    this.mediaElement.removeEventListener('error', this.onError);
  }

  protected init(options?: IMediaStateOptions) {
    this.setOptions(options);
    this.displayState();

    this.onPlay = () => this.displayState();
    this.onPause = () => this.displayState();
    this.onEnded = () => {
      this.displayState();
      if (this.revertOnEnded) this.mediaElement.currentTime = 0; // Revert;
    };
    this.onClick = () => this.toggleAction();
    this.onError = () => this.displayState();

    this.mediaElement.addEventListener('play', this.onPlay);
    this.mediaElement.addEventListener('pause', this.onPause);
    this.mediaElement.addEventListener('ended', this.onEnded);
    this.mediaElement.addEventListener('error', this.onError);

    if (this.enableControl) {
      this.viewElement.addEventListener('click', this.onClick);
    }
  }

  protected setOptions(options?: IMediaStateOptions) {
    this.classPlay = options?.classPlay ?? this.classPlay;
    this.classPause = options?.classPause ?? this.classPause;
    this.classEnded = options?.classEnded ?? this.classEnded;
    this.classError = options?.classError ?? this.classError;
    this.enableControl = options?.enableControl ?? this.enableControl;
    this.revertOnEnded = options?.revertOnEnded ?? this.revertOnEnded;
  }

  protected displayState() {
    let currentClass = this.mediaElement.paused ? this.classPause : this.classPlay;

    this.viewElement.classList.remove(
      this.classPause,
      this.classPlay,
      this.classEnded,
      this.classError,
    );
    this.viewElement.classList.add(currentClass);
    if (this.mediaElement.ended) this.viewElement.classList.add(this.classEnded);
    if (this.mediaElement.error) this.viewElement.classList.add(this.classError);
  }

  protected toggleAction() {
    if (!this.mediaElement.duration) return;

    this.mediaElement.paused ? this.mediaElement.play() : this.mediaElement.pause();
  }
}
