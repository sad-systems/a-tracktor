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
  | 'timePointer'
  | 'timerElapsed'
  | 'timerRemaining'
  | 'timerDuration'
  | 'buttonPlay'
  | 'buttonVolume'
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
 * Options for the MediaPlayer.
 */
export interface IMediaPlayerOptions {
  /** URL of poster image for the media source. */
  poster?: string;
  /** Initial media source volume. Value should be in range of [0 - 1] (it means: 0 - 100%). */
  volume?: number;
  /** Initial time position offset in seconds. */
  position?: number;

  /** CSS selector or HTML container element to render player content. Auto created by default. */
  viewElement?: HTMLElement | string;
  /** CSS class for player container HTML element. By default `media-player-item`. */
  viewElementClass?: string;
  /** Tag of player container HTML element. By default `div`. */
  viewElementTag?: string;

  /** CSS selector or reference to the HTML media element taken as the source of media data. Auto created by default. */
  mediaElement?: HTMLMediaElement | string;
  /** The type of media data created by default. By default `MediaType.AUDIO`. */
  mediaType?: MediaType;
  /** Strategy to preload media content. By default `metadata`. */
  mediaSourcePreload?: TMediaSourcePreload;

  /** CSS class to add to auto created video element. By default `poster`. */
  videoElementClass?: string;

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
  viewSelectors?: { [key in TMediaElements]: string | null | undefined };
  /**
   * Possible cases:
   *   - TRUE means always remove media element when destroy method is called.
   *   - FALSE means never remove media element when destroy method is called.
   *   - UNDEFINED means remove media element only if it was automatically created.
   */
  removeMediaOnDestroy?: boolean;
}
/**
 * HTML template for Media player without volume slide.
 */
export const TEMPLATE_WITHOUT_VOLUME_SLIDER = `
  <div class="poster"></div>
  <div class="analyzer"></div>
  <div class="controls">
    <button class="button button-play"><span class="glyphicon"/></button>
    <div class="timer elapsed"></div>
    <div class="time-pointer"></div>
    <!--div class="timer duration"></div-->
    <div class="timer remaining"></div>
    <button class="button button-volume"><span class="glyphicon"/></button>
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
  protected viewSelectors: { [key in TMediaElements]: string | null | undefined } = {
    poster: '.poster',
    analyzer: '.analyzer',
    timePointer: '.time-pointer',
    timerElapsed: '.timer.elapsed',
    timerRemaining: '.timer.remaining',
    timerDuration: '.timer.duration',
    buttonPlay: '.button-play',
    buttonVolume: '.button-volume',
    volumeSlider: '.volume-slider',
    volumeLevel: '.volume-level',
    volumeValue: '.volume-value',
  };
  protected videoElementClass = 'poster';
  protected viewElementClass = 'media-player-item';
  protected viewElement: HTMLElement;
  protected viewElementTag: string = 'div';
  protected mediaElement: HTMLMediaElement;
  protected mediaType: MediaType = MediaType.AUDIO;
  protected poster?: string;
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
  protected buttonVolumeClassActive: string = 'active';

  // Instance params.
  protected viewElements: { [key in TMediaElements]: HTMLElement | null | undefined } = {
    poster: null,
    analyzer: null,
    timePointer: null,
    timerElapsed: null,
    timerRemaining: null,
    timerDuration: null,
    buttonPlay: null,
    buttonVolume: null,
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
  protected mediaVolume?: MediaVolume;
  protected onPlay: () => void;
  protected onPause: () => void;
  protected onButtonVolumeClick: () => void;

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

  protected setOptions(options?: IMediaPlayerOptions) {
    this.poster = options?.poster ?? this.poster;
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

    this.isViewElementDefined = !!this.viewElement;
    this.isMediaElementDefined = !!this.mediaElement;
    this.removeMediaOnDestroy = options?.removeMediaOnDestroy ?? this.removeMediaOnDestroy;
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
    const extension = source.toLowerCase().substring(source.lastIndexOf('.') + 1);

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
        this.videoElementClass && this.mediaElement.classList.add(this.videoElementClass);
      }
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
    this.viewElement.classList.add(this.viewElementClass);
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

      this.onPlay = () => {
        try {
          this.analyzer?.start();
        } catch (e) {
          console.error(e);
        }
      };
      this.onPause = () => this.analyzer?.stop();

      this.mediaElement.addEventListener('play', this.onPlay);
      this.mediaElement.addEventListener('pause', this.onPause);
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

    // Button Volume.
    if (this.viewElements.buttonVolume) {
      this.onButtonVolumeClick = () =>
        this.viewElements.volumeSlider?.classList.toggle(this.buttonVolumeClassActive);
      this.viewElements.buttonVolume.addEventListener('click', this.onButtonVolumeClick);
    }

    // Volume slider.
    if (this.viewElements.volumeSlider) {
      this.mediaVolume = new MediaVolume(this.mediaElement, this.viewElements.volumeSlider, {
        levelViewElement: this.viewElements.volumeLevel!,
        levelTextElement: this.viewElements.volumeValue!,
        iconButtonElement: this.viewElements.buttonVolume!,
      });
    }
  }

  protected unregister() {
    this.mediaElement.removeEventListener('play', this.onPlay);
    this.mediaElement.removeEventListener('pause', this.onPause);
    this.viewElements.buttonVolume?.removeEventListener('click', this.onButtonVolumeClick);
    this.analyzer?.stop();
    this.mediaTimePointer?.destroy();
    this.timerElapsed?.destroy();
    this.timerRemaining?.destroy();
    this.timerDuration?.destroy();
    this.mediaVolume?.destroy();
  }
}
