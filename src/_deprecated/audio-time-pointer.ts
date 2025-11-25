/**
 * @mergeModuleWith deprecated
 * @packageDocumentation
 */

/**
 * Possible values for mode of the audio time pointer.
 * @deprecated
 */
enum EnumAudioTimePointerMode {
  /** Draws pointer as a line */
  line = 'line',
  /** Draws pointer as a bar */
  bar = 'bar',
}

/**
 * Interface for AudioTimePointer options.
 * @deprecated
 */
interface IAudioTimePointerOptions {
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
   * Enable or disable pointer movement on mouse click.
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
  mode?: EnumAudioTimePointerMode;
}

/**
 * Audio time pointer widget.
 *
 * @hideconstructor
 * @deprecated Use {@link media-player-components.MediaTimePointer} instead.
 */
export class AudioTimePointer {
  protected pointerElement: HTMLElement;
  protected isPointerInternal: boolean = false;
  protected pointerStyle: any;
  protected pointerClass: string;
  protected enableControl: boolean;
  protected pointerMode: EnumAudioTimePointerMode;

  protected onTimeUpdate: (this: HTMLMediaElement, ev: Event) => void;
  protected onPointerClick: (this: HTMLMediaElement, ev: Event) => void;

  /**
   * Constructor
   *
   * @param audioElement Input HTML element with source audio.
   * @param viewElement  The parent container to append the time pointer.
   * @param options      Option params.
   */
  constructor(
    protected audioElement: HTMLMediaElement,
    protected viewElement: HTMLElement,
    protected options?: IAudioTimePointerOptions,
  ) {
    this.init(options);
  }

  /**
   * Updates the canvas size depended on the [[constructor|viewElement]] size.
   */
  resize() {
    if (this.pointerElement && this.isPointerInternal) {
      this.pointerElement.style.height = String(this.viewElement.offsetHeight);
    }
    this.movePointerToCurrentTime();
  }

  /**
   * Removes all constructed elements and event listeners.
   */
  destroy() {
    this.unregister();
    this.removePointer();
  }

  protected setOptions(options?: IAudioTimePointerOptions) {
    options = options || {};

    this.pointerMode = options.mode || EnumAudioTimePointerMode.line;
    this.pointerClass = options.pointerClass;
    this.pointerStyle = !this.pointerClass
      ? { ...this.getPointerDefaultStyle(), ...options.pointerStyle }
      : undefined;
    this.pointerElement = this.createPointer(options.pointerElement);
    this.enableControl = options.enableControl === undefined ? true : options.enableControl;
  }

  protected init(options?: IAudioTimePointerOptions) {
    this.setOptions(options);
    this.resize();
    this.register();
  }

  protected getPointerDefaultStyle(): any {
    return {
      position: 'absolute',
      width: '1px',
      top: '0',
      left: '0',
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
    this.pointerElement = undefined;
  }

  protected movePointerToCurrentTime() {
    if (this.pointerElement) {
      let pos =
        (this.audioElement.currentTime * this.viewElement.offsetWidth) / this.audioElement.duration;

      switch (this.pointerMode) {
        case EnumAudioTimePointerMode.bar:
          this.pointerElement.style.width = String(pos);
          break;

        default: // line
          // Centring the position for the 'fat' pointer.
          if (this.pointerElement.offsetWidth > 1) {
            pos -= this.pointerElement.offsetWidth / 2;
          }

          this.pointerElement.style.left = String(pos);
      }
    }
  }

  protected setCurrentTimeByClick(event: MouseEvent) {
    const duration = this.audioElement.duration;
    const width = this.viewElement.offsetWidth;
    const pos = (duration * event.offsetX) / width;

    this.audioElement.currentTime = pos;
  }

  protected register() {
    this.onTimeUpdate = () => this.movePointerToCurrentTime();
    this.onPointerClick = (event: MouseEvent) => this.setCurrentTimeByClick(event);
    this.audioElement.addEventListener('timeupdate', this.onTimeUpdate);
    if (this.enableControl) {
      this.viewElement.addEventListener('click', this.onPointerClick);
    }
  }

  protected unregister() {
    this.audioElement.removeEventListener('timeupdate', this.onTimeUpdate);
    this.viewElement.removeEventListener('click', this.onPointerClick);
  }
}
