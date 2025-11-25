/**
 * @mergeModuleWith analyzers
 * @packageDocumentation
 */
import { AbstractAnalyzer, IAbstractAnalyzerOptions } from '../../common/abstract-analyzer';

/**
 * Options for the Amplitude analyzer.
 */
export interface IAmplitudeAnalyzerOptions extends IAbstractAnalyzerOptions {
  /**
   * Color for the value of very high level (clipping level).
   */
  colorClip?: string;
  /**
   * Color for the value of high level (warning level).
   */
  colorWarn?: string;
  /**
   * Color for the value of the normal level.
   */
  colorNorm?: string;
  /**
   * A number in the range [0..1] represents the percentage of the signal value after which it is considered very high
   * (clipping value).
   *
   * `0.9` by default (means 90%)
   */
  valueClip?: number;
  /**
   * A number in the range [0..1] represents the percentage of the signal value after which it is considered high.
   *
   * `0.8` by default (means 80%)
   */
  valueWarn?: number;
  /**
   * The size of the split bars for the level scale (in pixels).
   *
   * `5` by default.
   */
  barSize?: number;
  /**
   * If `true` then the input signal will be automatically split into two channels and presented as a double scale.
   *
   * `true` is by default.
   */
  stereo?: boolean;
  /**
   * Style for the level scale.
   * Can be represented as a simple `color` ('#f00'), `CanvasGradient` or `CanvasPattern`.
   */
  fillStyle?: string | CanvasGradient | CanvasPattern;
}

/**
 * Amplitude analyzer widget.
 *
 * ![](../../docs/assets/images/amp-widget.jpg)
 *
 * Example:
 * ```javascript
 * const audioElement = document.getElementById('audio');
 * const viewElement = document.getElementById('div-analyzer');
 *
 * const a = new AmplitudeAnalyzer(audioElement, viewElement, { colorClip: '#f00' });
 *
 * // We can start only after user starts interact with our page.
 * // This is because of HTML Web Audio API restriction.
 * document.body.onclick = () => {
 *   audioElement.play();
 *   a.start();
 * }
 * ```
 *
 * See more options at interface definition: {@link IAmplitudeAnalyzerOptions}
 */
export class AmplitudeAnalyzer extends AbstractAnalyzer {
  protected analyser2: AnalyserNode;

  // Options
  protected colorClip: string;
  protected colorWarn: string;
  protected colorNorm: string;
  protected valueClip: number;
  protected valueWarn: number;
  protected barSize: number;
  protected stereo: boolean;
  protected fillStyle: string | CanvasGradient | CanvasPattern;

  protected getDefaultFftSize(): number {
    return 2048;
  }

  protected setOptions(options?: IAmplitudeAnalyzerOptions) {
    super.setOptions(options);

    options = options || {};

    this.colorClip = options.colorClip || '#f00';
    this.colorWarn = options.colorWarn || '#ff0';
    this.colorNorm = options.colorNorm || '#0f0';
    this.valueClip = options.valueClip === undefined ? 0.9 : options.valueClip;
    this.valueWarn = options.valueWarn === undefined ? 0.8 : options.valueWarn;
    this.barSize = options.barSize === undefined ? 5 : options.barSize;
    this.stereo = options.stereo === undefined ? true : options.stereo;
    this.fillStyle = options.fillStyle;
  }

  protected createAnalyzer() {
    this.analyser = this.audioContext.createAnalyser(); // Создание анализатора сигнала первого канала (левого)

    if (this.stereo) {
      const splitter = this.audioContext.createChannelSplitter(2); // Создание разделителя каналов.

      this.mediaSource.connect(splitter);
      this.analyser2 = this.audioContext.createAnalyser(); // Создание анализатора сигнала второго канала (правого)

      splitter.connect(this.analyser, 0); // Left channel
      splitter.connect(this.analyser2, 1); // Right channel
    } else {
      this.mediaSource.connect(this.analyser, this.sourceChannel);
    }
  }

  protected getStyle(): string | CanvasGradient | CanvasPattern {
    if (!this.fillStyle) {
      this.fillStyle = this.canvasContext.createLinearGradient(0, this.height, 0, 0);
      this.fillStyle.addColorStop(0, this.colorNorm);
      this.fillStyle.addColorStop(this.valueWarn, this.colorWarn);
      this.fillStyle.addColorStop(this.valueClip, this.colorClip);
    }

    return this.fillStyle;
  }

  /**
   * Creates measurement dividing bars.
   *
   * @param x
   * @param width
   * @param y
   * @param height
   */
  protected digitizeLevel(x: number, width: number, y: number, height: number) {
    for (let i = y + 1; i < height; i++) {
      this.canvasContext.clearRect(x, i * this.barSize, width, 1);
    }
  }

  /**
   * Draws amplitude level graph.
   */
  protected render = () => {
    this.requestAniFrameID = requestAnimationFrame(this.render);

    this.clear();

    if (this.stereo) {
      this.drawLevel(this.analyser, 0, this.width / 2 - 1, 0, this.height);
      this.drawLevel(this.analyser2, this.width / 2, this.width / 2 - 1, 0, this.height);
    } else {
      this.drawLevel(this.analyser, 0, this.width, 0, this.height);
    }

    this.digitizeLevel(0, this.width, 0, this.height);
  };

  /**
   * Draws amplitude level for the given analyzer.
   *
   * @param analyser
   * @param x
   * @param width
   * @param y
   * @param height
   */
  protected drawLevel(analyser: AnalyserNode, x: number, width: number, y: number, height: number) {
    analyser.getByteTimeDomainData(this.dataArray);

    const maxValue = Math.max(...Array.from(this.dataArray));
    const barHeight = (maxValue / 128) * height;

    this.canvasContext.fillStyle = this.getStyle();
    this.canvasContext.fillRect(x, height, width, height - barHeight);
  }
}
