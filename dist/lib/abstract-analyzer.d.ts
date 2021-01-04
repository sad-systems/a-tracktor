/**
 * Interface of the static audio source storage item.
 */
export interface IAudioSource {
    /**
     * Reference to the HTML audio element taken as the source of audio data.
     */
    audioElement: HTMLMediaElement;
    /**
     * Audio context for the audio data.
     * [more details](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext)
     */
    audioContext: AudioContext;
    /**
     * The media source for the audio data.
     * [more details](https://developer.mozilla.org/en-US/docs/Web/API/MediaElementAudioSourceNode)
     */
    mediaSource: MediaElementAudioSourceNode;
}
/**
 * Basic analyzer options.
 */
export interface IAbstractAnalyzerOptions {
    /**
     * The number of the source channel to analyze.
     *   - 0 - left channel (by default)
     *   - 1 - right channel
     */
    sourceChannel?: number;
    /**
     * Should or not to connect the analyzer to the destination output.
     * `true` by default.
     */
    connectDestination?: boolean;
    /**
     * An unsigned long value and represents the window size in samples that is used when performing
     * a Fast Fourier Transform (FFT) to get frequency domain data.
     * Must be a power of 2 between 2^5 and 2^15, so one of: 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, and 32768.
     */
    fftSize?: number;
    /**
     * Main color of widget drawing.
     */
    color?: string;
}
/**
 * Abstract analyzer widget.
 *
 * This class is the basic class to inherit and implement other widgets.
 */
export declare abstract class AbstractAnalyzer {
    protected viewElement: HTMLElement;
    protected canvasElement: HTMLCanvasElement;
    protected canvasContext: CanvasRenderingContext2D;
    protected width: number;
    protected height: number;
    protected audioElement: HTMLMediaElement;
    protected audioContext: AudioContext;
    protected mediaSource: MediaElementAudioSourceNode;
    protected sourceChannel: number;
    protected connectDestination: boolean;
    protected analyser: AnalyserNode;
    protected bufferLength: number;
    protected dataArray: Uint8Array;
    protected requestAniFrameID: number;
    protected isAudioContextInitialized: boolean;
    protected static audioSources: IAudioSource[];
    protected fftSize: number;
    protected color: string;
    /**
     * Constructor.
     *
     * @param audioSource Input HTML element with source audio (HTML audio tag) or structure of IAudioSource.
     * @param viewElement The HTML element to render the widget. Will be auto created if it is undefined or null.
     * @param options     Analyzer options.
     */
    constructor(audioSource?: HTMLMediaElement | MediaElementAudioSourceNode | null, viewElement?: HTMLElement | null, options?: IAbstractAnalyzerOptions);
    /**
     * Starts rendering.
     */
    start(): void;
    /**
     * Pauses rendering.
     */
    pause(): void;
    /**
     * Stops rendering.
     */
    stop(): void;
    /**
     * Updates the canvas size depended on the [[constructor|viewElement]] size.
     */
    resize(): void;
    /**
     * Clears the canvas.
     */
    clear(): void;
    /**
     * Returns the audio source structure for this instance.
     */
    getAudioSource(): IAudioSource;
    /**
     * Returns the ViewElement for this instance.
     */
    getViewElement(): HTMLElement;
    protected getDefaultFftSize(): number;
    protected getDefaultColor(): string;
    protected getDefaultViewElement(): HTMLElement;
    protected setOption(options?: IAbstractAnalyzerOptions): void;
    protected setViewElement(viewElement?: HTMLElement | null): void;
    protected setAudioSource(audioSource?: HTMLMediaElement | MediaElementAudioSourceNode | null): void;
    protected initView(): void;
    protected initAudio(): void;
    protected createAnalyzer(): void;
    protected initAnalyzer(): void;
    protected static createAudioSourceForElement(audioElement: HTMLMediaElement, connectDestination: boolean): IAudioSource;
    protected static findAudioSourceByElement(audioElement: HTMLMediaElement): IAudioSource | void;
    /**
     * Converts short format color '#abc' to long format color: '#aabbcc'.
     *
     * @param color
     */
    protected static normalizeColor(color: string): string;
    /**
     * Draws analyzer graphic.
     *
     * Method to override.
     */
    protected abstract render(): void;
}
