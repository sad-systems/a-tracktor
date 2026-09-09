/**
 * @mergeModuleWith media-player
 * @packageDocumentation
 */
import {
  EnumMediaTimePointerMode,
  IMediaTimePointerOptions,
  MediaTimePointer,
} from '../media-player-components/media-time-pointer';
import { MediaTimer, MediaTimerType } from '../media-player-components/media-timer';
import { IMediaStateOptions, MediaState } from '../media-player-components/media-state';
import { MediaVolume } from '../media-player-components/media-volume';
import { AbstractAnalyzer } from '../../common/abstract-analyzer';
import { WaveformAnalyzer } from '../analyzers/waveform-analyzer';
import { getFullscreenElement, toggleFullScreen } from '../../utils/fullscreen';
import { debounce } from '../../utils/debounce';
import { SliderType } from '../../utils/slider';

/**
 * Strategy to preload media content.
 * List of values for defining the method of preloading media content.
 * - `none` - do not preload media content
 * - `metadata` - preload metadata only
 * - `auto` - auto detect
 */
export type TMediaSourcePreload = 'none' | 'metadata' | 'auto' | '';
/**
 * List of Media player HTML view elements to bind controls.
 */
export type TMediaElements =
  | 'poster'
  | 'analyzer'
  | 'controls'
  | 'timePointer'
  | 'timerElapsed'
  | 'timerRemaining'
  | 'timerDuration'
  | 'buttonPlay'
  | 'buttonVolume'
  | 'buttonFullscreen'
  | 'volumeSlider'
  | 'volumeLevel'
  | 'volumeValue';
/**
 * Types of media.
 */
export enum MediaType {
  AUDIO = 'audio',
  VIDEO = 'video',
}
/**
 * List of Media player events for callbacks.
 *
 * - `clickPoster`     - Callback for "click on Poster" event. Signature:
 *   ```
 *   (mp: MediaPlayer) => void
 *   ```
 * - `enterFullscreen` - Callback for "enter to full-screen mode" event. Signature:
 *   ```
 *   (mp: MediaPlayer) => void
 *   ```
 * - `exitFullscreen`  - Callback for "exit from full-screen mode" event. Signature:
 *   ```
 *   (mp: MediaPlayer) => void
 *   ```
 * - `play`            - Callback for "start playing the media" event. Signature:
 *   ```
 *   (mp: MediaPlayer) => void
 *   ```
 * - `pause`           - Callback for "pause playing the media" event. Signature:
 *   ```
 *   (mp: MediaPlayer) => void
 *   ```
 * - `ended`           - Callback for "playing the media is ended" event. Signature:
 *   ```
 *   (mp: MediaPlayer) => void
 *   ```
 * - `changeVolume`    - Callback for "volume is changed" event. Signature:
 * ```
 *   (value: number) => void
 * ```
 *   Where the value is in the range from 0 to 1 (meaning: from 0 to 100% of the volume).
 * - `changePosition`  - Callback for "position is changed by user" event. Signature:
 * ```
 *   (value: number) => void
 * ```
 *   Where the value is in the range from 0 to 1 (meaning: from 0 to 100% of the duration).
 */
export type TMediaPlayerEvents =
  | 'clickPoster'
  | 'enterFullscreen'
  | 'exitFullscreen'
  | 'play'
  | 'pause'
  | 'ended'
  | 'changeVolume'
  | 'changePosition';

/**
 * Options for the MediaPlayer.
 */
export interface IMediaPlayerOptions {
  /** Hash array of Media player events to register callbacks. */
  events?: { [key in TMediaPlayerEvents]?: (params: any) => void };
  /** URL of poster image for the media source. */
  poster?: string;
  /** Hint for poster image. */
  posterHint?: string;
  /**
   * CSS class to add to poster element.
   * Can be specified as a list of class names or as a string containing class names separated by spaces.
   *
   * By default for video: `frame-aspect-ratio-16x9` and for audio `frame-aspect-ratio-4x3`.
   */
  posterElementClass?: string | string[];
  /** Initial media source volume. Value should be in range of [0 - 1] (it means: 0 - 100%). */
  volume?: number;
  /** Initial time position offset in seconds. */
  position?: number;

  /** CSS selector or HTML container element to render player content. Auto created by default. */
  viewElement?: HTMLElement | string;
  /**
   * CSS class for player container HTML element.
   * Can be specified as a list of class names or as a string containing class names separated by spaces.
   *
   * By default `media-player-item`.
   */
  viewElementClass?: string | string[];
  /** Tag of player container HTML element. By default `div`. */
  viewElementTag?: string;

  /** CSS selector or reference to the HTML media element taken as the source of media data. Auto created by default. */
  mediaElement?: HTMLMediaElement | string;
  /** The type of media data created by default. By default `MediaType.AUDIO`. */
  mediaType?: MediaType;
  /** Strategy to preload media content. By default `metadata`. */
  mediaSourcePreload?: TMediaSourcePreload;

  /**
   * CSS class to add to auto created video element.
   * Can be specified as a list of class names or as a string containing class names separated by spaces.
   *
   * By default `poster`.
   */
  videoElementClass?: string | string[];

  /**
   * Class of audio analyzer to visualize audio.
   *
   * - For audio source is set to `WaveformAnalyzer` by default.
   * - For video source is set to `null` by default and should be set manually if needed.
   */
  analyzerClass?: AbstractAnalyzer | null;
  /** Audio analyzer options if needed. */
  analyzerOptions?: any;
  /** MediaTimePointer component options if needed. */
  mediaTimePointerOptions?: IMediaTimePointerOptions;
  /** MediaState component options if needed. */
  mediaStateOptions?: IMediaStateOptions;
  /** CSS class to add to `buttonVolume` element if panel with `volumeSlider` is open.  By default `active`. */
  buttonVolumeClassActive?: string;
  /** CSS class to add to `buttonFullscreen` when the element is in the full screen mode. By default `fullscreen-on`. */
  buttonFullscreenClassOn?: string;
  /** CSS class to add to `buttonFullscreen` when the element is not in the full screen mode. By default `fullscreen-off`. */
  buttonFullscreenClassOff?: string;
  /** Force the Fullscreen button to appear. */
  enableButtonFullscreen?: boolean;

  /** HTML template with Media player structure. By default defined by {@link TEMPLATE_WITH_HORIZONTAL_VOLUME_SLIDER}. */
  template?: string;
  /**
   * List of CSS selectors to bind view elements.
   * May be redefined if custom template is used for Media player.
   *
   * Bindings by default:
   *
       - poster: '.poster'
       - analyzer: '.analyzer'
       - controls: '.controls'
       - timePointer: '.time-pointer'
       - timerElapsed: '.timer.elapsed'
       - timerRemaining: '.timer.remaining'
       - timerDuration: '.timer.duration'
       - buttonPlay: '.button-play'
       - buttonVolume: '.button-volume'
       - volumeSlider: '.volume-slider'
       - volumeLevel: '.volume-level'
       - volumeValue: '.volume-value'
   */
  viewSelectors?: { [key in TMediaElements]?: string | null | undefined };
  /**
   * Possible cases:
   *   - TRUE means always remove media element when destroy method is called.
   *   - FALSE means never remove media element when destroy method is called.
   *   - UNDEFINED means remove media element only if it was automatically created.
   */
  removeMediaOnDestroy?: boolean;
  /**
   * The number of seconds after which the controls are hidden during playback.
   * By default, it is automatically set to 1 second for video only.
   */
  autoHideControls?: number;
  /**
   * The number of seconds after which the analyzer is hidden during playback.
   * By default, it is automatically set to 1 second for video only.
   */
  autoHideAnalyzer?: number;
  /**
   * The delay in seconds to display auto-hidden controls and the analyzer after the user taps the poster.
   * By default, it is automatically set to 1 second for video only.
   */
  delayShowAfterTap?: number;
}
/**
 * HTML template for Media player without volume slide.
 */
export const TEMPLATE_WITHOUT_VOLUME_SLIDER = `
  <div class="poster"></div>
  <div class="analyzer"></div>
  <div class="controls">
    <button class="button button-play"><span class="media-controls-icon"/></button>
    <div class="timer elapsed"></div>
    <div class="time-pointer"></div>
    <!--div class="timer duration"></div-->
    <div class="timer remaining"></div>
    <button class="button button-volume"><span class="media-controls-icon"/></button>
    <button class="button button-fullscreen fullscreen-off"><span class="media-controls-icon"/></button>
  </div>
`;
/**
 * HTML template of horizontal volume slide.
 */
export const TEMPLATE_HORIZONTAL_VOLUME_SLIDER = `
  <div class="volume-slider fx-slide-up">
    <div class="volume-level horizontal-level"></div>
    <div class="volume-value"></div>
  </div>
`;
/**
 * HTML template of vertical volume slide.
 */
export const TEMPLATE_VERTICAL_VOLUME_SLIDER = `
  <div class="volume-slider vertical fx-slide-left">
    <div class="volume-level vertical-level"></div>
    <div class="volume-value"></div>
  </div>
`;
/**
 * Complete HTML template for Media player with horizontal volume slide.
 */
export const TEMPLATE_WITH_HORIZONTAL_VOLUME_SLIDER =
  TEMPLATE_WITHOUT_VOLUME_SLIDER + TEMPLATE_HORIZONTAL_VOLUME_SLIDER;
/**
 * Complete HTML template for Media player with vertical volume slide.
 */
export const TEMPLATE_WITH_VERTICAL_VOLUME_SLIDER =
  TEMPLATE_WITHOUT_VOLUME_SLIDER + TEMPLATE_VERTICAL_VOLUME_SLIDER;

/**
 * Customizable media player widget.
 *
 * ![](../../docs/assets/images/media-player-3.png)
 *
 * @example
 * ```javascript
 * const mediaPlayer = new MediaPlayer('audio.mp3', {
 *   poster: 'image.jpg',
 *   viewElement: '.media-player',
 * });
 * ```
 *
 * @see [Complete example for MediaPlayerList](../../docs/pages/060-media-player.md)
 */
export class MediaPlayer {
  /**
   * List of all video formats for automatic media type detection.
   */
  public static videoExtensions = ['mp4', 'webm', 'ogv', 'mov', 'avi'];

  // User options.
  protected template = TEMPLATE_WITH_HORIZONTAL_VOLUME_SLIDER;
  protected viewSelectors: { [key in TMediaElements]?: string | null | undefined } = {
    poster: '.poster',
    analyzer: '.analyzer',
    controls: '.controls',
    timePointer: '.time-pointer',
    timerElapsed: '.timer.elapsed',
    timerRemaining: '.timer.remaining',
    timerDuration: '.timer.duration',
    buttonPlay: '.button-play',
    buttonVolume: '.button-volume',
    buttonFullscreen: '.button-fullscreen',
    volumeSlider: '.volume-slider',
    volumeLevel: '.volume-level',
    volumeValue: '.volume-value',
  };
  protected videoElementClass: string | string[] = 'poster';
  protected viewElementClass: string | string[] = 'media-player-item';
  protected viewElement: HTMLElement;
  protected viewElementTag: string = 'div';
  protected mediaElement: HTMLMediaElement;
  protected mediaType: MediaType = MediaType.AUDIO;
  protected poster?: string;
  protected posterHint?: string;
  protected posterElementClass?: string | string[];
  protected volume?: number;
  protected position?: number;
  protected mediaSourcePreload: TMediaSourcePreload = 'metadata';
  protected analyzerClass: AbstractAnalyzer | null = WaveformAnalyzer as any;
  protected analyzerOptions: any = { color: '#c00' };
  protected mediaTimePointerOptions: IMediaTimePointerOptions = {
    mode: EnumMediaTimePointerMode.BAR,
    pointerStyle: { top: '', bottom: '', background: '' },
    pointerClass: 'time-pointer-knob',
    enableControl: true,
  };
  protected mediaStateOptions: IMediaStateOptions = { enableControl: true, revertOnEnded: true };
  protected buttonVolumeClassActive = 'active';
  protected buttonFullscreenClassOn = 'fullscreen-on';
  protected buttonFullscreenClassOff = 'fullscreen-off';
  protected enableButtonFullscreen?: boolean;
  protected autoHideControls?: number;
  protected autoHideAnalyzer?: number;
  protected delayShowAfterTap?: number;
  protected events: { [key in TMediaPlayerEvents]?: (params: any) => void } = {};

  // Instance params.
  protected viewElements: { [key in TMediaElements]?: HTMLElement | null | undefined } = {
    poster: null,
    analyzer: null,
    controls: null,
    timePointer: null,
    timerElapsed: null,
    timerRemaining: null,
    timerDuration: null,
    buttonPlay: null,
    buttonVolume: null,
    buttonFullscreen: null,
    volumeSlider: null,
    volumeLevel: null,
    volumeValue: null,
  };
  protected removeMediaOnDestroy?: boolean;
  protected isViewElementDefined = false;
  protected isMediaElementDefined = false;
  protected mediaTimePointer?: MediaTimePointer;
  protected analyzer?: AbstractAnalyzer;
  protected timerElapsed?: MediaTimer;
  protected timerRemaining?: MediaTimer;
  protected timerDuration?: MediaTimer;
  protected mediaState?: MediaState;
  protected mediaState2?: MediaState;
  protected mediaVolume?: MediaVolume;
  protected onPlay: () => void;
  protected onPause: () => void;
  protected onEnded: () => void;
  protected onChangeVolume?: () => void;
  protected onChangePosition?: () => void;
  protected onButtonVolumeClick: () => void;
  protected onClickOutsideVolumeSlider: (event: PointerEvent) => void;
  protected onButtonButtonFullscreenClick: () => void;
  protected onClickViewElement: () => void;
  protected controlsListeners: Record<string, Function> = {};
  protected timerToHideControls?: any;
  protected timerToHideAnalyzer?: any;
  protected timerToHideAfterTap?: any;
  protected isControlsUsed = false;

  /**
   * Constructor.
   *
   * @param mediaSource  Media file URL.
   * @param options      Optional params.
   */
  constructor(
    protected mediaSource?: string,
    options?: IMediaPlayerOptions,
  ) {
    this.setOptions(options);
    this.init();
  }

  /**
   * Destroys all elements and removes all their own event listeners.
   */
  destroy() {
    this.stop();
    this.unregister();
    this.removeMediaOnDestroy && this.mediaElement.remove();
    this.viewElement.remove();
  }

  /**
   * Redraws all elements.
   */
  resize() {
    this.mediaTimePointer?.resize();
    this.analyzer?.resize();
  }

  /**
   * Sets the current media source to play.
   *
   * @param mediaSource URL of media source.
   */
  setMediaSource(mediaSource?: string) {
    const needResumePlay = !this.mediaElement.paused;
    const onDataLoaded = () => {
      this.mediaElement.removeEventListener('error', onError);
      needResumePlay && this.play();
    };
    const onError = (e: ErrorEvent) => {
      this.mediaElement.removeEventListener('loadeddata', onDataLoaded);
      console.warn('Load media error:', e);
    };

    this.stop();

    this.mediaElement.addEventListener('loadeddata', onDataLoaded, { once: true });
    this.mediaElement.addEventListener('error', (e) => onError, { once: true });

    this.mediaElement.src = mediaSource ?? '';
  }

  /**
   * Sets the current poster image.
   *
   * @param url URL of poster image.
   */
  setPoster(url?: string) {
    this.poster = url ?? '';
    this.createPoster();
  }

  /**
   * Returns the current view element (HTML container of the player).
   */
  getViewElement(): HTMLElement {
    return this.viewElement;
  }

  /**
   * Returns the current media element (HTML container of media data).
   */
  getMediaElement(): HTMLMediaElement {
    return this.mediaElement;
  }

  /**
   * Starts play media content.
   */
  play() {
    this.mediaElement.duration && this.mediaElement.play();
  }

  /**
   * Pauses playing media content.
   */
  pause() {
    this.mediaElement.pause();
    this.analyzer?.stop();
  }

  /**
   * Stops playing media content and reset time pointer.
   */
  stop() {
    this.pause();
    this.mediaElement.currentTime = 0;
    this.mediaTimePointer?.resize();
  }

  /**
   * Toggle media content playback.
   */
  toggle() {
    this.mediaElement.paused ? this.play() : this.pause();
  }

  protected setOptions(options?: IMediaPlayerOptions) {
    this.poster = options?.poster ?? this.poster;
    this.posterHint = options?.posterHint ?? this.posterHint;
    this.volume = options?.volume ?? this.volume;
    this.position = options?.position ?? this.position;
    if (this.volume && !(this.volume >= 0 && this.volume <= 1))
      throw Error(`Param 'volume' must be in range [0-1], but [${this.volume}] is given`);

    // Define view element from options.
    if (options?.viewElement) {
      if (options.viewElement instanceof HTMLElement) {
        this.viewElement = options.viewElement;
      } else if (typeof options.viewElement === 'string') {
        this.viewElement = document.querySelector<HTMLDivElement>(options.viewElement)!;
      }
      if (!this.viewElement) {
        throw Error('[MP] options.viewElement is incorrect!');
      }
    }

    this.viewElementClass = options?.viewElementClass ?? this.viewElementClass;
    this.viewElementTag = options?.viewElementTag ?? this.viewElementTag;
    this.videoElementClass = options?.videoElementClass ?? this.videoElementClass;

    // Define media element from options.
    if (options?.mediaElement) {
      if (options.mediaElement instanceof HTMLMediaElement) {
        this.mediaElement = options.mediaElement;
      } else if (typeof options.mediaElement === 'string') {
        this.mediaElement = document.querySelector<HTMLMediaElement>(options.mediaElement)!;
      }
      if (!this.mediaElement) {
        throw Error('[MP] options.mediaElement is incorrect!');
      }
    }

    this.mediaType = options?.mediaType ?? this.autoDetectMediaSourceType(this.mediaSource); // Auto detect.
    this.mediaSourcePreload = options?.mediaSourcePreload ?? this.mediaSourcePreload;
    this.template = options?.template ?? this.template;
    this.viewSelectors = { ...this.viewSelectors, ...options?.viewSelectors };

    // Audio analyzer.
    if (this.mediaType === MediaType.VIDEO) {
      // For video.
      this.analyzerClass = options?.analyzerClass ?? null;
    } else {
      // For audio.
      this.analyzerClass =
        options?.analyzerClass === null ? null : (options?.analyzerClass ?? this.analyzerClass);
    }
    this.analyzerOptions = options?.analyzerOptions ?? this.analyzerOptions;

    this.mediaTimePointerOptions = {
      ...this.mediaTimePointerOptions,
      ...options?.mediaTimePointerOptions,
    };
    this.mediaStateOptions = { ...this.mediaStateOptions, ...options?.mediaStateOptions };
    this.buttonVolumeClassActive = options?.buttonVolumeClassActive ?? this.buttonVolumeClassActive;
    this.buttonFullscreenClassOn = options?.buttonFullscreenClassOn ?? this.buttonFullscreenClassOn;
    this.buttonFullscreenClassOff =
      options?.buttonFullscreenClassOff ?? this.buttonFullscreenClassOff;
    this.enableButtonFullscreen = options?.enableButtonFullscreen ?? this.enableButtonFullscreen;

    if (this.enableButtonFullscreen === undefined) {
      this.enableButtonFullscreen = this.mediaType === MediaType.VIDEO;
    }

    // Auto hide controls.
    this.autoHideControls = options?.autoHideControls ?? this.autoHideControls;
    if (this.autoHideControls === undefined && this.mediaType === MediaType.VIDEO) {
      this.autoHideControls = 1; // By default.
    }
    // Auto hide analyzer.
    this.autoHideAnalyzer = options?.autoHideAnalyzer ?? this.autoHideAnalyzer;
    // if (this.autoHideAnalyzer === undefined && this.mediaType === MediaType.VIDEO) {
    //   this.autoHideAnalyzer = 0.5; // By default.
    // }
    // Auto show controls and analyzer after tap.
    this.delayShowAfterTap = options?.delayShowAfterTap ?? this.delayShowAfterTap;
    if (this.delayShowAfterTap === undefined && this.mediaType === MediaType.VIDEO) {
      this.delayShowAfterTap = 1; // By default.
    }

    this.isViewElementDefined = !!this.viewElement;
    this.isMediaElementDefined = !!this.mediaElement;
    this.removeMediaOnDestroy = options?.removeMediaOnDestroy ?? this.removeMediaOnDestroy;

    // Set additional CSS class for poster with appropriate aspect-ratio.
    this.posterElementClass =
      options?.posterElementClass ??
      this.posterElementClass ??
      (this.mediaType === MediaType.VIDEO ? 'frame-aspect-ratio-16x9' : 'frame-aspect-ratio-4x3');

    // Set user callbacks for events.
    this.events = { ...this.events, ...options.events };
  }

  protected init() {
    this.createMedia();
    this.createView();
    this.addMediaElementToView();
  }

  /**
   * Auto detects a media source type (audio or video).
   *
   * @param source URL f media file source.
   */
  protected autoDetectMediaSourceType(source?: string): MediaType {
    const extension = source
      .replace(/\?.*$/, '') // Remove query params if exists.
      .replace(/^.*\./, '') // Remove all before the last dot.
      .toLowerCase();

    if (MediaPlayer.videoExtensions.includes(extension)) {
      return MediaType.VIDEO;
    }

    return MediaType.AUDIO;
  }

  protected createMedia() {
    if (!this.mediaElement) {
      this.mediaElement = document.createElement(this.mediaType) as HTMLMediaElement;
      this.removeMediaOnDestroy = this.removeMediaOnDestroy ?? true;
    }

    this.mediaElement.crossOrigin = 'anonymous'; // Important!

    if (this.mediaSource) {
      this.mediaElement.src = this.mediaSource;
    }

    this.mediaElement.currentTime = this.position ?? this.mediaElement.currentTime;
    this.mediaElement.volume = this.volume ?? this.mediaElement.volume;
    this.mediaElement.preload = this.mediaSourcePreload ?? this.mediaElement.preload;

    if (this.mediaType === MediaType.VIDEO) {
      // To enable inline video on Apple devices.
      this.mediaElement.setAttribute('playsinline', '');
    }
  }

  /**
   * Adds the media HTML element to the view HTML element
   * if the media element was created automatically.
   *
   * WARNING: It's very important!
   *          The "audio" tag is required on the page for mobile devices!
   *          Otherwise, files will not be playable!
   */
  protected addMediaElementToView() {
    if (!this.isMediaElementDefined) {
      // Audio.
      if (this.mediaType === MediaType.AUDIO) {
        this.mediaElement.style.display = 'none';
        this.viewElement.append(this.mediaElement);
      } else {
        // Video.
        if (this.viewElements.poster) {
          this.viewElements.poster.replaceWith(this.mediaElement);
        } else {
          this.viewElement.prepend(this.mediaElement);
        }
        // CSS class for video.
        this.addCssClassesToElement(this.mediaElement, this.videoElementClass);
      }
    }
  }

  /**
   * Adds CSS classes to the given HTML element.
   *
   * @param el          HTML element.
   * @param cssClasses  Classes as array or the string with 'space' as separator.
   */
  protected addCssClassesToElement(el: HTMLElement, cssClasses?: string[] | string) {
    if (cssClasses) {
      let classList: string[] = [];

      if (typeof cssClasses === 'string') {
        classList = cssClasses.replace(/\s+/, ' ').split(' ');
      } else if (cssClasses instanceof Array) {
        classList = cssClasses;
      }

      classList.forEach((className) => el.classList.add(className));
    }
  }

  protected createView() {
    if (!this.isViewElementDefined) {
      this.viewElement = document.createElement(this.viewElementTag as any);
      // Insensibly add to DOM (to calculate real HTML params). Important!
      this.viewElement.style.visibility = 'hidden';
      document.body.append(this.viewElement);
    }

    this.viewElement.innerHTML = this.template; // Render template.
    this.addCssClassesToElement(this.viewElement, this.viewElementClass);
    this.bindElements();
    this.createPoster();
    this.register();

    if (!this.isViewElementDefined) {
      // Remove from DOM.
      this.viewElement.remove();
      this.viewElement.style.visibility = '';
    }
  }

  protected bindElements() {
    Object.keys(this.viewElements).forEach((key: TMediaElements) => {
      this.viewElements[key] = this.viewElement.querySelector<HTMLDivElement>(
        this.viewSelectors[key],
      );
    });
  }

  protected createPoster() {
    if (this.poster) {
      // Set audio poster.
      if (this.viewElements.poster && this.mediaType === MediaType.AUDIO) {
        this.viewElements.poster.style.backgroundImage = `url(${this.poster})`;
      }
      // Set video poster.
      if (this.mediaType === MediaType.VIDEO) {
        (this.mediaElement as HTMLVideoElement).poster = this.poster;
      }
    }

    const posterContainer =
      this.mediaType === MediaType.VIDEO ? this.mediaElement : this.viewElements.poster;

    if (posterContainer) {
      // Add props to poster.
      if (this.posterHint) posterContainer.title = this.posterHint;
      if (this.events.clickPoster) {
        posterContainer.classList.add('clickable-element');
        posterContainer.addEventListener('click', () => this.events.clickPoster(this));
      }
      // Additional CSS class for poster.
      this.addCssClassesToElement(posterContainer, this.posterElementClass);
    }
  }

  protected register() {
    // Audio analyzer.
    if (this.viewElements.analyzer && this.analyzerClass) {
      // @ts-ignore
      this.analyzer = new this.analyzerClass(
        this.mediaElement,
        this.viewElements.analyzer,
        this.analyzerOptions,
      );
    }

    // Time pointer.
    if (this.viewElements.timePointer) {
      this.mediaTimePointer = new MediaTimePointer(
        this.mediaElement,
        this.viewElements.timePointer,
        this.mediaTimePointerOptions,
      );
    }

    // Elapsed timer.
    if (this.viewElements.timerElapsed) {
      this.timerElapsed = new MediaTimer(this.mediaElement, this.viewElements.timerElapsed, {
        type: MediaTimerType.ELAPSED,
        pointerElement: this.viewElements.timePointer!,
      });
    }

    // Remaining timer.
    if (this.viewElements.timerRemaining) {
      this.timerRemaining = new MediaTimer(this.mediaElement, this.viewElements.timerRemaining, {
        type: MediaTimerType.REMAINING,
        pointerElement: this.viewElements.timePointer!,
      });
    }

    // Duration timer.
    if (this.viewElements.timerDuration) {
      this.timerDuration = new MediaTimer(this.mediaElement, this.viewElements.timerDuration, {
        type: MediaTimerType.DURATION,
        pointerElement: this.viewElements.timePointer!,
      });
    }

    // Button Play.
    if (this.viewElements.buttonPlay) {
      this.mediaState = new MediaState(
        this.mediaElement,
        this.viewElements.buttonPlay,
        this.mediaStateOptions,
      );
    }
    // Add CSS state classes to Main container.
    this.mediaState2 = new MediaState(this.mediaElement, this.viewElement, {
      ...this.mediaStateOptions,
      enableControl: false,
      revertOnEnded: false,
    });

    // Button Volume.
    if (this.viewElements.buttonVolume) {
      // Handler for click outside the slider.
      this.onClickOutsideVolumeSlider = (event: PointerEvent) => {
        // If click was made outside slider and volume button.
        if (
          !this.viewElements.volumeSlider.contains(event.target as any) &&
          !this.viewElements.buttonVolume.contains(event.target as any) &&
          this.viewElements.volumeSlider.classList.contains(this.buttonVolumeClassActive)
        ) {
          // Remove active class and stop listening outside.
          this.viewElements.volumeSlider.classList.remove(this.buttonVolumeClassActive);
          document.removeEventListener('click', this.onClickOutsideVolumeSlider);
        }
      };

      // Handler for click on volume button.
      this.onButtonVolumeClick = () => {
        if (this.viewElements.volumeSlider) {
          document.removeEventListener('click', this.onClickOutsideVolumeSlider);
          // Set handler to control click outside the slider, if slider is in an inactive state.
          if (!this.viewElements.volumeSlider.classList.contains(this.buttonVolumeClassActive)) {
            document.addEventListener('click', this.onClickOutsideVolumeSlider);
          }
        }

        this.viewElements.volumeSlider?.classList.toggle(this.buttonVolumeClassActive);
      };

      // Register handler.
      this.viewElements.buttonVolume.addEventListener('click', this.onButtonVolumeClick);
    }

    // Volume slider.
    if (this.viewElements.volumeSlider) {
      this.mediaVolume = new MediaVolume(this.mediaElement, this.viewElements.volumeSlider, {
        levelViewElement: this.viewElements.volumeLevel!,
        levelTextElement: this.viewElements.volumeValue!,
        iconButtonElement: this.viewElements.buttonVolume!,
        sliderType: this.viewElements.volumeSlider.classList.contains('vertical') && SliderType.Y,
      });
    }

    // Button Fullscreen.
    if (this.enableButtonFullscreen && this.viewElements.buttonFullscreen) {
      const onToggle = () => {
        this.resize();
        this.viewElements.buttonFullscreen.classList.toggle(this.buttonFullscreenClassOff);
        this.viewElements.buttonFullscreen.classList.toggle(this.buttonFullscreenClassOn);
        this.viewElement.classList.toggle(this.buttonFullscreenClassOn);
      };

      if (getFullscreenElement()) {
        this.viewElement.classList.add(this.buttonFullscreenClassOn);
        this.viewElements.buttonFullscreen.classList.add(this.buttonFullscreenClassOn);
      } else {
        this.viewElements.buttonFullscreen.classList.add(this.buttonFullscreenClassOff);
      }

      this.onButtonButtonFullscreenClick = () => {
        toggleFullScreen(
          this.viewElement,
          {},
          () => {
            onToggle();
            this.events.enterFullscreen && this.events.enterFullscreen(this);
          },
          () => {
            onToggle();
            this.events.exitFullscreen && this.events.exitFullscreen(this);
          },
          (e) => console.warn(e),
        );
      };

      this.viewElements.buttonFullscreen.addEventListener(
        'click',
        this.onButtonButtonFullscreenClick,
      );
    } else {
      this.viewElements.buttonFullscreen?.remove();
    }

    // Playing controls.
    this.onPlay = () => {
      try {
        this.analyzer?.start();
      } catch (e) {
        console.error(e);
      }
      this.autoHideViewElements();
      this.events.play && this.events.play(this);
    };
    this.onPause = () => {
      this.analyzer?.stop();
      this.autoShowViewElements();
      this.events.pause && this.events.pause(this);
    };
    this.onEnded = () => {
      if (this.mediaType === MediaType.VIDEO) {
        // Redraw the poster on ending @todo in future
      }
      this.events.ended && this.events.ended(this);
    };
    if (this.events.changeVolume) {
      this.onChangeVolume = () => {
        this.events.changeVolume(this.mediaElement.volume);
      };
    }
    if (this.events.changePosition) {
      this.onChangePosition = () => {
        this.events.changePosition(
          this.mediaElement.duration > 0
            ? this.mediaElement.currentTime / this.mediaElement.duration
            : 0,
        );
      };
    }

    this.mediaElement.addEventListener('play', this.onPlay);
    this.mediaElement.addEventListener('pause', this.onPause);
    this.mediaElement.addEventListener('ended', this.onEnded);
    this.mediaElement.addEventListener('volumechange', this.onChangeVolume);
    this.mediaElement.addEventListener('seeking', this.onChangePosition);

    // Show controls after tap.
    if (this.delayShowAfterTap) {
      this.onClickViewElement = () => this.showAfterTap();
      this.viewElement.addEventListener('click', this.onClickViewElement);
    }

    // Set flag: controls is in use or released,
    // to avoid auto hiding when the user moves the time pointer.
    if (this.autoHideControls && this.viewElements.controls) {
      const useControls = () => (this.isControlsUsed = true);
      const releaseControls = () => (this.isControlsUsed = false);
      const releaseControlsWithDebounce = debounce(() => releaseControls(), 1000);
      const touchControls = () => {
        useControls();
        releaseControlsWithDebounce();
      };
      // Define EventListeners map.
      this.controlsListeners = {
        mousedown: useControls,
        mouseup: releaseControls,
        touchmove: touchControls,
      };
      // Set EventListeners.
      Object.keys(this.controlsListeners).forEach((key) =>
        this.viewElements.controls.addEventListener(key as any, this.controlsListeners[key] as any),
      );
    }
  }

  /**
   * Auto hides view element in given number of seconds.
   *
   * @param viewElement Given HTML element.
   * @param seconds     Number of seconds.
   *
   * @returns The setTimeout timer reference.
   */
  protected autoHide(viewElement?: HTMLElement, seconds?: number) {
    if (seconds && viewElement) {
      return setTimeout(() => {
        if (!this.mediaElement.paused) viewElement.classList.add('hidden-element');
      }, seconds * 1000);
    }
  }

  /**
   * Immediately shows the view element hidden by `autoHide` method.
   *
   * @param viewElement Given HTML element.
   * @param timer       The setTimeout timer reference.
   */
  protected autoShow(viewElement?: HTMLElement, timer?: any) {
    if (timer) clearTimeout(timer);
    if (viewElement) viewElement.classList.remove('hidden-element');
  }

  /**
   * Auto hides the group of view elements.
   */
  protected autoHideViewElements() {
    // If controls are in use now, we should wait until they are released.
    if (this.isControlsUsed) {
      setTimeout(() => this.autoHideViewElements(), 1000);
      return;
    }

    // Hide the elements.
    clearTimeout(this.timerToHideControls);
    clearTimeout(this.timerToHideAnalyzer);

    this.timerToHideControls = this.autoHide(this.viewElements.controls, this.autoHideControls);
    this.timerToHideAnalyzer = this.autoHide(this.viewElements.analyzer, this.autoHideAnalyzer);
  }

  /**
   * Immediately shows the group of view elements hidden by `autoHideViewElements` method.
   */
  protected autoShowViewElements() {
    clearTimeout(this.timerToHideAfterTap);
    this.autoShow(this.viewElements.controls, this.timerToHideControls);
    this.autoShow(this.viewElements.analyzer, this.timerToHideAnalyzer);
  }

  /**
   * Immediately shows the group of view elements hidden by `autoHideViewElements` and hides it after delay.
   */
  protected showAfterTap() {
    if (this.delayShowAfterTap) {
      this.autoShowViewElements();
      this.timerToHideAfterTap = setTimeout(
        () => this.autoHideViewElements(),
        this.delayShowAfterTap * 1000,
      );
    }
  }

  protected unregister() {
    this.mediaElement.removeEventListener('play', this.onPlay);
    this.mediaElement.removeEventListener('pause', this.onPause);
    this.mediaElement.removeEventListener('ended', this.onEnded);
    this.mediaElement.removeEventListener('volumechange', this.onChangeVolume);
    this.mediaElement.removeEventListener('seeking', this.onChangePosition);
    this.viewElement.removeEventListener('click', this.onClickViewElement);
    this.viewElements.buttonVolume?.removeEventListener('click', this.onButtonVolumeClick);
    Object.keys(this.controlsListeners).forEach((key) =>
      this.viewElements.controls?.removeEventListener(
        key as any,
        this.controlsListeners[key] as any,
      ),
    );
    document.removeEventListener('click', this.onClickOutsideVolumeSlider);
    this.viewElements.buttonFullscreen?.removeEventListener(
      'click',
      this.onButtonButtonFullscreenClick,
    );
    this.analyzer?.stop();
    this.mediaTimePointer?.destroy();
    this.timerElapsed?.destroy();
    this.timerRemaining?.destroy();
    this.timerDuration?.destroy();
    this.mediaVolume?.destroy();
    this.mediaState?.destroy();
    this.mediaState2?.destroy();
  }
}
