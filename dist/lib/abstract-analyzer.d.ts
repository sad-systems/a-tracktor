/**
 * Interface of the static audio source storage item.
 */
export interface IAudioSource {
    audioElement: HTMLMediaElement;
    audioContext: AudioContext;
    mediaSource: MediaElementAudioSourceNode;
}
/**
 * Basic analyzer options.
 */
export interface IAbstractAnalyzerOptions {
    sourceChannel?: number;
    connectDestination?: boolean;
    fftSize?: number;
    color?: string;
}
/**
 * Abstract analyzer widget.
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
     * @param viewElement The HTML element to render the widget. Will be auto created if undefined or null.
     * @param options     Analyzer options.
     */
    constructor(audioSource?: HTMLMediaElement | MediaElementAudioSourceNode | null, viewElement?: HTMLElement | null, options?: IAbstractAnalyzerOptions);
    /**
     * Start rendering.
     */
    start(): void;
    /**
     * Pause rendering.
     */
    pause(): void;
    /**
     * Stop rendering.
     */
    stop(): void;
    /**
     * Updates the canvas size depended on element size.
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
