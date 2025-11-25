/**
 * @mergeModuleWith media-player-components
 * @packageDocumentation
 */
import { Slider, SliderType } from '../../utils/slider';
import { debounce } from '../../utils/debounce';
import { bounds } from '../../utils/bounds';

/**
 * Possible values for mode of the media time pointer.
 */
export enum EnumMediaTimePointerMode {
  /** Draws pointer as a line */
  LINE = 'line',
  /** Draws pointer as a bar */
  BAR = 'bar',
}

/**
 * Interface for MediaTimePointer options.
 */
export interface IMediaTimePointerOptions {
  /**
   * Reference to the HTML element which could be used as a pointer instead of auto generated.
   * `pointerStyle` and `pointerClass` will not be applied to this element.
   */
  pointerElement?: HTMLElement;
  /**
   * HTML element styles properties for auto generated pointer element.
   *
   * For example:
   * ```
   * { background: '#f00', width: '10px' }
   * ```
   */
  pointerStyle?: any;
  /**
   * CSS class name for auto generated pointer element.
   * If this property is set the `pointerStyle` property will be ignored.
   */
  pointerClass?: string;
  /**
   * Enable or disable pointer movement on mouse click or drag.
   * `true` means the pointer will be controlled by the mouse click.
   *
   * `true` by default.
   */
  enableControl?: boolean;
  /**
   * Mode to draw the pointer.
   *
   * `line` by default.
   */
  mode?: EnumMediaTimePointerMode;
  /**
   * The delay in milliseconds for the pointer when the user moves it.
   *
   * `500` by default.
   */
  pointerDebounceDelay?: number;
}

/**
 * Media time pointer widget.
 *
 * ![](../../docs/assets/images/audio-time-pointer.png)
 *
 * Class to create an audio or video time pointer control
 * that displays the current time position and allows it to be changed.
 *
 * The time pointer for `mediaElement` will be auto drawn and appended inside the `viewElement` as child element.
 *
 * Example:
 * ```javascript
 *
 * const mediaElement = document.getElementById('audio');
 * const viewElement = document.getElementById('div-analyzer');
 *
 * // Line time pointer:
 * const mediaTimePointer1 = new MediaTimePointer(mediaElement, viewElement);
 * // or
 * // Bar time pointer:
 * const mediaTimePointer2 = new MediaTimePointer(mediaElement, viewElement, { mode: 'bar', pointerStyle: { background: '#0f0a' });
 *
 * ```
 *
 * See more options at interface definition: {@link IMediaTimePointerOptions}
 */
export class MediaTimePointer {
  protected pointerElement: HTMLElement;
  protected isPointerInternal: boolean = false;
  protected pointerStyle: any;
  protected pointerClass: string;
  protected enableControl: boolean;
  protected pointerMode: EnumMediaTimePointerMode;
  protected pointerDebounceDelay = 500;

  protected onTimeUpdate: (this: HTMLMediaElement, ev: Event) => void;
  protected onPointerClick: (this: HTMLMediaElement, ev: Event) => void;
  protected slider?: Slider;

  /**
   * Constructor
   *
   * @param mediaElement Input HTML element with source audio or video.
   * @param viewElement  The parent container to append the time pointer.
   * @param options      Option params.
   */
  constructor(
    protected mediaElement: HTMLMediaElement,
    protected viewElement: HTMLElement,
    protected options?: IMediaTimePointerOptions,
  ) {
    this.init(options);
  }

  /**
   * Updates the canvas size depended on the [[constructor|viewElement]] size.
   */
  resize() {
    this.automaticallyMovePointerToCurrentTime();
  }

  /**
   * Removes all constructed elements and event listeners.
   */
  destroy() {
    this.unregister();
    this.removePointer();
  }

  protected setOptions(options?: IMediaTimePointerOptions) {
    options = options || {};

    this.pointerMode = options.mode || EnumMediaTimePointerMode.LINE;
    this.pointerClass = options.pointerClass ?? '';
    this.pointerStyle = { ...this.getPointerDefaultStyle(), ...options.pointerStyle };
    this.pointerElement = this.createPointer(options.pointerElement);
    this.enableControl = options.enableControl === undefined ? true : options.enableControl;
    this.pointerDebounceDelay = options.pointerDebounceDelay ?? this.pointerDebounceDelay;
  }

  protected init(options?: IMediaTimePointerOptions) {
    this.setOptions(options);
    this.resize();
    this.register();
  }

  protected getPointerDefaultStyle(): any {
    return {
      position: 'absolute',
      width: this.pointerMode === EnumMediaTimePointerMode.LINE ? '1px' : '0',
      top: '0',
      left: '0',
      bottom: '0',
      backgroundColor: '#fff7',
    };
  }

  protected createPointer(pointerElement?: HTMLElement): HTMLElement {
    if (!pointerElement) {
      pointerElement = document.createElement('div');

      if (this.pointerClass) {
        pointerElement.classList.add(this.pointerClass);
      }
      if (this.pointerStyle) {
        for (const key in this.pointerStyle) {
          if (this.pointerStyle.hasOwnProperty(key)) {
            pointerElement.style[key as any] = this.pointerStyle[key];
          }
        }
      }

      // Change default 'static' to 'relative' position for container element.
      if (getComputedStyle(this.viewElement).position === 'static') {
        this.viewElement.style.position = 'relative';
      }

      this.viewElement.append(pointerElement);
      this.isPointerInternal = true;
    }

    return pointerElement;
  }

  protected removePointer() {
    if (this.pointerElement && this.isPointerInternal) {
      this.pointerElement.remove();
    }
    delete this.pointerElement; // = undefined;
  }

  /**
   * Draws pointer at the new position.
   *
   * @param percent Position as a percentage of the view element's width.
   *                Value in range of 0 - 1 (means 0 - 100%).
   */
  protected movePointer(percent: number = 0) {
    if (!this.mediaElement.duration) return;

    const pos = (percent || 0) * this.viewElement.offsetWidth;

    if (this.pointerElement) {
      switch (this.pointerMode) {
        case EnumMediaTimePointerMode.BAR:
          this.pointerElement.style.width = String(pos) + 'px';
          break;

        default: // line
          // Centring the position for the 'fat' pointer.
          const left =
            this.pointerElement.offsetWidth > 1 ? pos - this.pointerElement.offsetWidth / 2 : pos;

          this.pointerElement.style.left = String(left) + 'px';
      }
    }

    // Trigger event 'pointer-move'.
    if (this.viewElement) {
      this.viewElement.dispatchEvent(this.createEventPointerMove(percent));
    }
  }

  /**
   * Flag. TRUE if the user is currently moving the pointer.
   */
  protected pointerMovingByUser = false;

  /**
   * Automatically moves pointer to current time.
   */
  protected automaticallyMovePointerToCurrentTime() {
    if (!this.pointerMovingByUser)
      this.movePointer(this.mediaElement.currentTime / this.mediaElement.duration);
  }

  /**
   * Sets the cursor position and current time of media element by value in range of 0 - 1.
   *
   * @param percent Value in range of 0 - 1 (means 0 - 100%).
   */
  protected setPointerCurrentTime(percent: number) {
    percent = bounds(percent);

    this.pointerMovingByUser = true;
    this.movePointer(percent);
    this.setDebouncedAudioCurrentTime(percent);
  }

  protected calculateAudioTime(percent: number): number {
    return percent * (this.mediaElement.duration ?? 0);
  }

  /**
   * Sets the current time of media element.
   */
  protected setAudioCurrentTime(pos: number) {
    this.mediaElement.currentTime = this.calculateAudioTime(pos) || 0;
    this.pointerMovingByUser = false;
  }

  /**
   * Sets the current time of media element with debounce protection.
   */
  protected setDebouncedAudioCurrentTime: (pos: number) => void;

  protected setCurrentTimeByClick(event: MouseEvent) {
    if (event.offsetX === 0 || !this.viewElement.offsetWidth) return; // @workaround: ignore random 0 offset on click.

    this.setPointerCurrentTime(event.offsetX / this.viewElement.offsetWidth);
  }

  protected register() {
    this.onTimeUpdate = () => this.automaticallyMovePointerToCurrentTime();
    this.onPointerClick = (event: MouseEvent) => this.setCurrentTimeByClick(event);
    this.mediaElement.addEventListener('timeupdate', this.onTimeUpdate);

    if (this.enableControl) {
      this.slider = new Slider(this.viewElement, (pos) => this.setPointerCurrentTime(pos), {
        type: SliderType.X,
      });
      this.viewElement.addEventListener('mousedown', this.onPointerClick);
    }

    this.setDebouncedAudioCurrentTime =
      this.pointerDebounceDelay === 0
        ? this.setAudioCurrentTime
        : debounce((pos: number) => this.setAudioCurrentTime(pos), this.pointerDebounceDelay);
  }

  protected unregister() {
    this.mediaElement.removeEventListener('timeupdate', this.onTimeUpdate);
    this.viewElement.removeEventListener('mousedown', this.onPointerClick);
    this.slider?.destroy();
  }

  protected createEventPointerMove(percent: number): CustomEvent {
    return new CustomEvent('pointer-move', {
      detail: { offsetPercent: percent },
      bubbles: true,
      cancelable: true,
    });
  }
}
