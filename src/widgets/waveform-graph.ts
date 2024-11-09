/**
 * Waveform graphic draw widget.
 *
 * ![](media://images/wavegraph-widget.jpg)
 *
 * Example 1: Just draw the waveform.
 * ```
 * const audioElement = document.getElementById('audio');
 * const viewElement = document.getElementById('div-analyzer');
 *
 * const waveFormGraph = new WaveformGraph(audioElement, viewElement, { colorPositive: '#00daff', colorNegative: '#00b6d5' });
 *
 * // We can start only after user starts interact with our page.
 * // This is because of HTML Web Audio API restriction.
 * document.body.onclick = () => {
 *   waveFormGraph.render();
 * }
 * ```
 *
 * Example 2: Draw the waveform and set the data to the other graph.
 * ```
 * const audioElement = document.getElementById('audio');
 * const viewElement1 = document.getElementById('div-analyzer-1');
 * const viewElement2 = document.getElementById('div-analyzer-2');
 *
 * const waveFormGraph1 = new WaveformGraph(audioElement, viewElement1, { colorPositive: '#00daff', colorNegative: '#00b6d5' });
 * const waveFormGraph2 = new WaveformGraph(new Audio(), viewElement2, { colorPositive: '#00daff', colorNegative: '#00b6d5' });
 *
 * // We can start only after user starts interact with our page.
 * // This is because of HTML Web Audio API restriction.
 * document.body.onclick = () => {
 *   // Draw the first graph.
 *   waveFormGraph1.render().then(() => {
 *     // Get a simplified data samples for drawing.
 *     // 2000 values are more than enough to draw fast and correct on full HD screen.
 *     const data = waveFormGraph1.getDataSampling(2000);
 *
 *     // Set obtained the data to the new waveform graph and draw it.
 *     waveFormGraph2.setDataSampling(data).render();
 *
 *     // Obtained "data" - You can save and use for fast render.
 *   });
 * }
 * ```
 *
 * See more options at interface definition: {@link IWaveFormGraphOptions}
 *
 * @packageDocumentation
 */
import { DEFAULT_WIDGET_HEIGHT, DEFAULT_WIDGET_WIDTH } from '../lib/defines';

/**
 * Options for the WaveformGraph widget.
 */
export interface IWaveFormGraphOptions {
  /**
   * The number of the source channel to analyze.
   *   - 0 - left channel
   *   - 1 - right channel
   *   - undefined - Max of the both channels
   */
  sourceChannel?: number;
  /**
   * Color of the positive values.
   */
  colorPositive?: string;
  /**
   * Color of the negative values.
   */
  colorNegative?: string;
  /**
   * Audio buffer to draw predefined waveform graphic.
   */
  audioBuffer?: AudioBuffer;
}

/**
 * Waveform graphic draw widget.
 */
export class WaveformGraph {
  protected canvasElement: HTMLCanvasElement;
  protected canvasContext: CanvasRenderingContext2D;
  protected width: number;
  protected height: number;
  protected audioContext?: AudioContext;
  protected decodedBuffer?: AudioBuffer;
  protected loadedAudioSource = '';

  protected sourceChannel?: number;
  protected colorPositive: string;
  protected colorNegative: string;

  protected dataSampling?: number[];

  /**
   * Constructor.
   *
   * @param audioElement Input HTML element with source audio (HTML audio tag).
   * @param viewElement  The HTML element to render the widget.
   * @param options      The widget options.
   */
  constructor(
    protected audioElement: HTMLMediaElement,
    protected viewElement: HTMLElement,
    protected options?: IWaveFormGraphOptions,
  ) {
    this.setOptions(options);
    this.init();
  }

  protected setOptions(options?: IWaveFormGraphOptions) {
    options = options || {};

    this.colorPositive = options.colorPositive || '#0f0';
    this.colorNegative = options.colorNegative || '#0a0';
    this.sourceChannel = options.sourceChannel;
    this.decodedBuffer = options.audioBuffer;
  }

  protected init() {
    this.canvasElement = document.createElement('canvas');
    this.canvasContext = this.canvasElement.getContext('2d');
    this.viewElement.append(this.canvasElement);
    this.setSize();
    this.reset();
  }

  protected getAudioContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)(); // Аудио контекст
    }

    return this.audioContext;
  }

  /**
   * Resets the graphic.
   */
  reset() {
    this.canvasContext.clearRect(0, 0, this.width, this.height);
  }

  /**
   * Updates the canvas size depended on element size.
   */
  resize() {
    this.setSize();
    this.createWaveForm();
  }

  /**
   * Returns the current audio buffer.
   */
  getAudioBuffer(): AudioBuffer | undefined {
    return this.decodedBuffer;
  }

  /**
   * Sets the current audio buffer.
   *
   * @param value Instance of the Audio buffer.
   * @see https://developer.mozilla.org/ru/docs/Web/API/AudioBuffer
   */
  setAudioBuffer(value: AudioBuffer) {
    this.decodedBuffer = value;
    this.dataSampling = undefined; // Reset dataSampling.

    return this;
  }

  /**
   * Returns an array of a specified number of data samples, taken at regular intervals.
   * The minimum amount of data to construct a wave form graphic of a given width (defined by number of samples).
   *
   * @param sampleCount       Number of samples.
   * @param sourceChannel     Optional source channel (0 - Left or 1 - Right).
   *                          If omitted the max of both channels for stereo audio will be taken.
   * @param sourceAudioBuffer Optional instance of a source audio buffer.
   *                          If omitted the current audio buffer will be taken.
   */
  getDataSampling(
    sampleCount: number,
    sourceChannel?: number,
    sourceAudioBuffer?: AudioBuffer,
  ): number[] {
    const audioBuffer = sourceAudioBuffer ?? this.getAudioBuffer();
    const primaryData = audioBuffer?.getChannelData(sourceChannel ?? 0) ?? new Float32Array(); // Primary channel data.
    const secondaryData =
      sourceChannel === undefined && audioBuffer?.numberOfChannels > 1
        ? audioBuffer.getChannelData(1)
        : undefined;

    return this.filterData(sampleCount, primaryData as any, secondaryData as any);
  }

  /**
   * Sets manually prepared audio data to draw the wave graphic.
   *
   * @param data Channel data of AudioBuffer or the data obtained from `getDataSampling` method.
   * @see https://developer.mozilla.org/ru/docs/Web/API/AudioBuffer
   */
  setDataSampling(data?: number[]) {
    this.dataSampling = data;

    return this;
  }

  /**
   * Loads audio from source URL and sets current audio buffer.
   *
   * @param src Source URL of audio.
   *
   * @returns Promise that resolves the current audio buffer.
   */
  async loadAudio(src?: string): Promise<AudioBuffer> {
    const source = src ?? this.audioElement.src;

    return fetch(source)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => this.getAudioContext().decodeAudioData(arrayBuffer))
      .then((decodedBuffer) => {
        this.loadedAudioSource = source;
        this.dataSampling = undefined;

        return (this.decodedBuffer = decodedBuffer);
      });
  }

  /**
   * Draws waveform graphic.
   *
   * @returns Promise that resolves an array of data samples used to construct a wave form graphic.
   */
  async render(): Promise<number[]> {
    if (
      (this.decodedBuffer || this.dataSampling) &&
      this.audioElement.src == this.loadedAudioSource
    ) {
      return this.createWaveForm();
    } else {
      return this.loadAudio(this.audioElement.src).then((decodedBuffer) => this.createWaveForm());
    }
  }

  protected setSize() {
    this.width = this.viewElement.offsetWidth || DEFAULT_WIDGET_WIDTH;
    this.height = this.viewElement.offsetHeight || DEFAULT_WIDGET_HEIGHT;
    this.canvasElement.width = this.width;
    this.canvasElement.height = this.height;
  }

  protected filterData(samples: number, primaryData: number[], secondaryData?: number[]): number[] {
    const blockSize = primaryData.length / samples; // The number of samples in each subdivision.
    const filteredData = [];
    for (let i = 0; i < samples; i++) {
      let blockStart = blockSize * i; // The location of the first sample in the block.
      let sum = 0;
      let count = 0;
      for (let j = 0; j < blockSize; j++) {
        const index = Math.round(blockStart) + j;
        if (primaryData[index] === undefined) break;

        let channelValue = Math.abs(primaryData[index]);
        count++;

        // Get the max of both channels for stereo audio.
        if (secondaryData) {
          channelValue = Math.max(channelValue, Math.abs(secondaryData[index]));
        }

        sum += channelValue; // Find the sum of all the samples in the block.
      }
      count && filteredData.push(sum / count); // divide the sum by the block size to get the average.
    }

    return filteredData;
  }

  protected drawSegment(x: number, y: number, width: number, isEven: boolean) {
    const height = isEven ? y : -y;
    this.canvasContext.fillStyle = isEven ? this.colorNegative : this.colorPositive;
    this.canvasContext.fillRect(x, this.height / 2, width, height);
  }

  protected drawWaveForm(data: number[], maxWidth: number, maxHeight: number) {
    this.reset();

    // Draw the segments
    const segmentWidth = maxWidth / data.length;

    for (let i = 0; i < data.length; i++) {
      const x = segmentWidth * i;
      let segmentHeight = data[i] * maxHeight;
      if (segmentHeight < 0) {
        segmentHeight = 0;
      } else if (segmentHeight > maxHeight) {
        segmentHeight = maxHeight;
      }
      this.drawSegment(x, segmentHeight, segmentWidth, !!((i + 1) % 2));
    }
  }

  protected createWaveForm(): number[] {
    let data = [];

    if (this.dataSampling) {
      // Create data from data sampling.
      data = this.filterData(this.width, this.dataSampling);
    } else {
      // Create data from current audio buffer.
      data = this.getDataSampling(this.width);
    }

    this.drawWaveForm(data, this.width, this.height);

    return data;
  }
}
