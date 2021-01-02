import { DEFAULT_WIDGET_HEIGHT, DEFAULT_WIDGET_WIDTH } from '../lib/defines';

/**
 * Options for the WaveFormGraph widget.
 */
export interface IWaveFormGraphOptions {
    colorPositive?: string;
    colorNegative?: string;
}

/**
 * Wave form graphic draw widget.
 */
export class WaveFormGraph {

    protected canvasElement: HTMLCanvasElement;
    protected canvasContext: CanvasRenderingContext2D;
    protected width: number;
    protected height: number;
    protected audioContext: AudioContext;
    protected isAudioContextInitialized = false;

    protected colorPositive: string;
    protected colorNegative: string;

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
        protected options?: any,
    )
    {
        this.setOption(options);
        this.init();
    }

    protected setOption(options?: IWaveFormGraphOptions) {
        options = options || {};

        this.colorPositive = options.colorPositive || '#0f0';
        this.colorNegative = options.colorNegative || '#0a0';
    }

    protected init() {
        this.canvasElement = document.createElement('canvas');
        this.canvasContext = this.canvasElement.getContext('2d');
        this.viewElement.append(this.canvasElement);
        this.width = this.viewElement.offsetWidth || DEFAULT_WIDGET_WIDTH;
        this.height = this.viewElement.offsetHeight || DEFAULT_WIDGET_HEIGHT;
        this.canvasElement.width = this.width;
        this.canvasElement.height = this.height;
        this.reset();
    }

    protected initAudio() {
        if (this.isAudioContextInitialized) return;

        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();  // Аудио контекст
        this.isAudioContextInitialized = true;
    }

    /**
     * Resets the graphic.
     */
    reset() {
        this.canvasContext.clearRect(0, 0, this.width, this.height);
    }

    /**
     * Draws waveform graphic.
     */
    render() {
        this.initAudio();

        fetch(this.audioElement.src)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => this.audioContext.decodeAudioData(arrayBuffer))
            .then((decodedBuffer) => this.createWaveForm(decodedBuffer));
    }

    protected filterData(audioBuffer: AudioBuffer): number[] {
        const rawData = audioBuffer.getChannelData(0); // We only need to work with one channel of data
        const samples = this.width;
        const blockSize = Math.floor(rawData.length / samples); // the number of samples in each subdivision
        const filteredData = [];
        for (let i = 0; i < samples; i++) {
            let blockStart = blockSize * i; // the location of the first sample in the block
            let sum = 0;
            for (let j = 0; j < blockSize; j++) {
                sum = sum + Math.abs(rawData[blockStart + j]) // find the sum of all the samples in the block
            }
            filteredData.push(sum / blockSize); // divide the sum by the block size to get the average
        }
        return filteredData;
    }

    protected drawSegment(x: number, y: number, width: number, isEven: boolean) {
        const height = isEven ? y : -y;
        this.canvasContext.fillStyle = isEven ? this.colorNegative : this.colorPositive;
        this.canvasContext.fillRect(x, this.height / 2, width, height);
    };

    protected createWaveForm(decodedBuffer: AudioBuffer) {
        this.reset();

        const data = this.filterData(decodedBuffer);
        const maxHeight = this.height;

        // draw the segments
        const width = this.width / data.length;
        for (let i = 0; i < data.length; i++) {
            const x = width * i;
            let height = data[i] * maxHeight;
            if (height < 0) {
                height = 0;
            } else if (height > maxHeight) {
                height = maxHeight;
            }
            this.drawSegment(x, height, width, !!((i + 1) % 2));
        }
    }
}