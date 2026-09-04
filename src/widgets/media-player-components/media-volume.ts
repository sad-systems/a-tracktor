/**
 * @mergeModuleWith media-player-components
 * @packageDocumentation
 */
import { Slider, SliderType } from '../../utils/slider';

/**
 * Interface for MediaVolume options.
 */
export interface IMediaVolumeOptions {
  /** Slider type. Auto is by default. */
  sliderType?: SliderType;
  /** HTML element to display current volume level graphical value. */
  levelViewElement?: HTMLElement;
  /** HTML element to display current volume level text value. */
  levelTextElement?: HTMLElement;
  /** HTML element to display volume icon (usually button). */
  iconButtonElement?: HTMLElement;
  /** CSS class to add to `iconButtonElement` when volume is muted. By default `muted`. */
  classMuted?: string;
  /** CSS class to add to `iconButtonElement` when volume is high. By default `volume-high`. */
  classVolumeHigh?: string;
  /** CSS class to add to `iconButtonElement` when volume is medium. By default `volume-medium`. */
  classVolumeMedium?: string;
  /** CSS class to add to `iconButtonElement` when volume is low. By default `volume-low`. */
  classVolumeLow?: string;
  /** CSS class to add to `iconButtonElement` when volume is very low. By default `volume-very-low`. */
  classVolumeVeryLow?: string;
}

/**
 * Component to display volume button state and slider control.
 */
export class MediaVolume {
  protected levelViewElement?: HTMLElement;
  protected levelTextElement?: HTMLElement;
  protected iconButtonElement?: HTMLElement;
  protected slider?: Slider;
  protected sliderType?: SliderType;
  protected classMuted = 'muted';
  protected classVolumeHigh = 'volume-high';
  protected classVolumeMedium = 'volume-medium';
  protected classVolumeLow = 'volume-low';
  protected classVolumeVeryLow = 'volume-very-low';
  protected onVolumechange: (this: HTMLMediaElement, ev: Event) => void;
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
    protected options?: IMediaVolumeOptions,
  ) {
    this.init(options);
  }

  /**
   * Removes all constructed elements and event listeners.
   */
  destroy() {
    this.mediaElement.removeEventListener('volumechange', this.onVolumechange);
    this.viewElement.removeEventListener('mousedown', this.onClick);
    this.slider?.destroy();
  }

  protected init(options?: IMediaVolumeOptions) {
    this.setOptions(options);
    this.displayState();

    this.onVolumechange = () => this.displayState();
    this.onClick = (event: MouseEvent) => this.setVolumeByClick(event);

    this.mediaElement.addEventListener('volumechange', this.onVolumechange);
    this.viewElement.addEventListener('mousedown', this.onClick);
    this.slider = new Slider(this.viewElement, (pos) => this.setVolume(pos), {
      type: this.sliderType,
    });
  }

  protected setOptions(options?: IMediaVolumeOptions) {
    this.levelViewElement = options?.levelViewElement ?? this.levelViewElement;
    this.levelTextElement = options?.levelTextElement ?? this.levelTextElement;
    this.sliderType = options?.sliderType ?? this.sliderType;
    this.iconButtonElement = options?.iconButtonElement ?? this.iconButtonElement;
    this.classMuted = options?.classMuted ?? this.classMuted;
    this.classVolumeHigh = options?.classVolumeHigh ?? this.classVolumeHigh;
    this.classVolumeLow = options?.classVolumeLow ?? this.classVolumeLow;
    this.classVolumeVeryLow = options?.classVolumeVeryLow ?? this.classVolumeVeryLow;
    this.classVolumeMedium = options?.classVolumeMedium ?? this.classVolumeMedium;

    if (!this.sliderType) {
      this.sliderType =
        this.viewElement.offsetWidth < this.viewElement.offsetHeight ? SliderType.Y : SliderType.X;
    }
  }

  protected displayState() {
    const valuePercent = this.mediaElement.volume * 100;

    // Display graphical value.
    if (this.levelViewElement) {
      const valuePercentString = valuePercent + '%';

      switch (this.sliderType) {
        case SliderType.X:
          this.levelViewElement.style.width = valuePercentString;
          break;
        case SliderType.Y:
          this.levelViewElement.style.height = valuePercentString;
          break;
      }
    }

    // Set css class for current state.
    if (this.iconButtonElement) {
      let currentClass = this.classMuted;

      if (valuePercent > 0) {
        currentClass = this.classVolumeVeryLow;
      }
      if (valuePercent >= 25) {
        currentClass = this.classVolumeLow;
      }
      if (valuePercent >= 50) {
        currentClass = this.classVolumeMedium;
      }
      if (valuePercent >= 75) {
        currentClass = this.classVolumeHigh;
      }

      this.iconButtonElement.classList.remove(
        this.classMuted,
        this.classVolumeHigh,
        this.classVolumeMedium,
        this.classVolumeLow,
        this.classVolumeVeryLow,
      );
      this.iconButtonElement.classList.add(currentClass);
    }

    // Display text value.
    if (this.levelTextElement) this.levelTextElement.innerText = String(Math.trunc(valuePercent));
  }

  protected setVolume(percent: number) {
    this.mediaElement.volume = Number(percent.toFixed(2));
  }

  protected setVolumeByClick(event: MouseEvent) {
    if (this.sliderType === SliderType.X) {
      if (event.offsetX === 0 || !this.viewElement.offsetWidth) return; // @workaround: ignore random 0 offset on click.

      this.setVolume(event.offsetX / this.viewElement.offsetWidth);
    } else {
      if (event.offsetY === 0 || !this.viewElement.offsetHeight) return; // @workaround: ignore random 0 offset on click.

      this.setVolume(
        (this.viewElement.offsetHeight - event.offsetY) / this.viewElement.offsetHeight,
      );
    }
  }
}
