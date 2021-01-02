import { DEFAULT_WIDGET_BACKGROUND_COLOR, DEFAULT_WIDGET_HEIGHT, DEFAULT_WIDGET_WIDTH } from './defines';

/**
 * Interface of the static audio source storage item.
 */
export interface IAudioSource {
    audioElement: HTMLMediaElement,
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
export abstract class AbstractAnalyzer {

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
    protected isAudioContextInitialized = false;

    protected static audioSources: IAudioSource[] = [];

    // Options
    protected fftSize: number;
    protected color: string;

    /**
     * Constructor.
     *
     * @param audioSource Input HTML element with source audio (HTML audio tag) or structure of IAudioSource.
     * @param viewElement The HTML element to render the widget. Will be auto created if undefined or null.
     * @param options     Analyzer options.
     */
    constructor(
        audioSource?: HTMLMediaElement | MediaElementAudioSourceNode | null,
        viewElement?: HTMLElement | null,
        options?: IAbstractAnalyzerOptions,
        )
    {
        this.setAudioSource(audioSource);
        this.setViewElement(viewElement);
        this.setOption(options);
        this.initView();
    }

    /**
     * Start rendering.
     */
    start() {
        this.initAudio();
        this.initAnalyzer();
        this.render();
    }

    /**
     * Pause rendering.
     */
    pause() {
        cancelAnimationFrame(this.requestAniFrameID);
    }

    /**
     * Stop rendering.
     */
    stop() {
        cancelAnimationFrame(this.requestAniFrameID);
        this.clear();
    }

    /**
     * Updates the canvas size depended on element size.
     */
    resize() {
        this.width = this.viewElement.offsetWidth || DEFAULT_WIDGET_WIDTH;
        this.height = this.viewElement.offsetHeight || DEFAULT_WIDGET_HEIGHT;
        this.canvasElement.width = this.width;
        this.canvasElement.height = this.height;
    }

    /**
     * Clears the canvas.
     */
    clear() {
        this.canvasContext.clearRect(0, 0, this.width, this.height);
    }

    /**
     * Returns the audio source structure for this instance.
     */
    getAudioSource(): IAudioSource {
        return {
            audioContext: this.audioContext,
            audioElement: this.audioElement,
            mediaSource: this.mediaSource,
        }
    }

    /**
     * Returns the ViewElement for this instance.
     */
    getViewElement(): HTMLElement {
        return this.viewElement;
    }

    protected getDefaultFftSize(): number {
        return 256;
    }

    protected getDefaultColor(): string {
        return '#fff';
    }

    protected getDefaultViewElement(): HTMLElement {
        const div = document.createElement('div');

        div.style.width = DEFAULT_WIDGET_WIDTH + 'px';
        div.style.height = DEFAULT_WIDGET_HEIGHT + 'px';
        div.style.backgroundColor = DEFAULT_WIDGET_BACKGROUND_COLOR;

        document.body.append(div);

        return div;
    }

    protected setOption(options?: IAbstractAnalyzerOptions) {
        options = options || { };
        this.fftSize = options.fftSize || this.getDefaultFftSize();
        this.color = AbstractAnalyzer.normalizeColor(options.color || this.getDefaultColor());
        this.sourceChannel = options.sourceChannel || 0;
        this.connectDestination = options.connectDestination === undefined ? true : options.connectDestination;
    }

    protected setViewElement(viewElement?: HTMLElement | null) {
        this.viewElement = viewElement || this.getDefaultViewElement();
    }

    protected setAudioSource(audioSource?: HTMLMediaElement | MediaElementAudioSourceNode | null) {
        if (audioSource) {
            if (audioSource instanceof HTMLMediaElement) {
                this.audioElement = audioSource;
            } else {
                this.mediaSource = audioSource;
            }
        }

        if (!this.audioElement) {
            this.audioElement = document.createElement('audio');
            // document.body.append(this.audioElement);
        }
    }

    protected initView() {
        this.viewElement = this.viewElement || this.getDefaultViewElement();
        this.canvasElement = document.createElement('canvas');
        this.canvasContext = this.canvasElement.getContext('2d');
        this.viewElement.append(this.canvasElement);
        this.resize();
        this.clear();
    }

    protected initAudio() {
        if (this.isAudioContextInitialized) return;

        if (this.mediaSource) {
            this.audioContext = this.mediaSource.context as AudioContext;
        } else {
            const audioSource = AbstractAnalyzer.createAudioSourceForElement(this.audioElement, this.connectDestination);

            this.audioContext = audioSource.audioContext;
            this.mediaSource = audioSource.mediaSource;
        }

        this.createAnalyzer();

        this.isAudioContextInitialized = true;
    }

    protected createAnalyzer() {
        this.analyser = this.audioContext.createAnalyser();           // Создание анализатора сигнала
        this.mediaSource.connect(this.analyser, this.sourceChannel);  // Соединение анализатора с каналом источника данных
    }

    protected initAnalyzer() {
        this.analyser.fftSize = this.fftSize;
        this.bufferLength = this.analyser.frequencyBinCount; // console.log('bufferLength:', this.bufferLength);
        this.dataArray = new Uint8Array(this.bufferLength);
    }

    protected static createAudioSourceForElement(audioElement: HTMLMediaElement, connectDestination: boolean): IAudioSource {
        let audioSource = AbstractAnalyzer.findAudioSourceByElement(audioElement);

        if (!audioSource) {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)(); // Аудио контекст
            const mediaSource = audioContext.createMediaElementSource(audioElement);                // Источник аудио данных

            if (connectDestination) {
                mediaSource.connect(audioContext.destination); // Соединение с приёмником аудио данных
            }

            audioSource = {
                audioElement,
                audioContext,
                mediaSource,
            }

            AbstractAnalyzer.audioSources.push(audioSource);
        }

        return audioSource;
    }

    protected static findAudioSourceByElement(audioElement: HTMLMediaElement): IAudioSource | void {
        return AbstractAnalyzer.audioSources.find((audioSource) => audioSource.audioElement === audioElement);
    }

    /**
     * Converts short format color '#abc' to long format color: '#aabbcc'.
     *
     * @param color
     */
    protected static normalizeColor(color: string): string {
        return color.replace(/^#(\w)(\w)(\w)$/, '#$1$1$2$2$3$3');
    }

    /**
     * Draws analyzer graphic.
     *
     * Method to override.
     */
    protected abstract render(): void;
}