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
}
/**
 * Waveform graphic draw widget.
 */
export declare class WaveformGraph {
    protected audioElement: HTMLMediaElement;
    protected viewElement: HTMLElement;
    protected options?: any;
    protected canvasElement: HTMLCanvasElement;
    protected canvasContext: CanvasRenderingContext2D;
    protected width: number;
    protected height: number;
    protected audioContext: AudioContext;
    protected isAudioContextInitialized: boolean;
    protected decodedBuffer: AudioBuffer;
    protected sourceChannel?: number;
    protected colorPositive: string;
    protected colorNegative: string;
    /**
     * Constructor.
     *
     * @param audioElement Input HTML element with source audio (HTML audio tag).
     * @param viewElement  The HTML element to render the widget.
     * @param options      The widget options.
     */
    constructor(audioElement: HTMLMediaElement, viewElement: HTMLElement, options?: any);
    protected setOption(options?: IWaveFormGraphOptions): void;
    protected init(): void;
    protected initAudio(): void;
    /**
     * Resets the graphic.
     */
    reset(): void;
    /**
     * Updates the canvas size depended on element size.
     */
    resize(): void;
    /**
     * Draws waveform graphic.
     */
    render(): void;
    protected setSize(): void;
    protected filterData(audioBuffer: AudioBuffer): number[];
    protected drawSegment(x: number, y: number, width: number, isEven: boolean): void;
    protected createWaveForm(decodedBuffer: AudioBuffer): void;
}
