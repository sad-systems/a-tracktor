/**
 * Waveform graphic draw widget.
 *
 * ![](media://images/wavegraph-widget.jpg)
 *
 * Example:
 * ```
 * const audioElement = document.getElementById('audio');
 * const viewElement = document.getElementById('div-analyzer');
 *
 * const waveFormGraph = new WaveformGraph(audioElement, viewElement, { colorPositive: '#00daff', colorNegative: '#00b6d5' });
 * waveFormGraph.render();
 * ```
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
}

/**
 * Waveform graphic draw widget.
 */
export class WaveformGraph {

    protected canvasElement: HTMLCanvasElement;
    protected canvasContext: CanvasRenderingContext2D;
    protected width: number;
    protected height: number;
    protected audioContext: AudioContext;
    protected isAudioContextInitialized = false;
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
        this.sourceChannel = options.sourceChannel;
    }

    protected init() {
        this.canvasElement = document.createElement('canvas');
        this.canvasContext = this.canvasElement.getContext('2d');
        this.viewElement.append(this.canvasElement);
        this.setSize();
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
     * Updates the canvas size depended on element size.
     */
    resize() {
        this.setSize();
        this.createWaveForm(this.decodedBuffer);
    }

    /**
     * Draws waveform graphic.
     */
    render() {
        this.initAudio();

        fetch(this.audioElement.src)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => this.audioContext.decodeAudioData(arrayBuffer))
            .then((decodedBuffer) => {
                this.decodedBuffer = decodedBuffer;
                this.createWaveForm(decodedBuffer);
            });
    }

    protected setSize() {
        this.width = this.viewElement.offsetWidth || DEFAULT_WIDGET_WIDTH;
        this.height = this.viewElement.offsetHeight || DEFAULT_WIDGET_HEIGHT;
        this.canvasElement.width = this.width;
        this.canvasElement.height = this.height;
    }

    protected filterData(audioBuffer: AudioBuffer): number[] {
        const primaryData = audioBuffer.getChannelData(this.sourceChannel || 0); // primary channel data
        const secondaryData = this.sourceChannel === undefined && audioBuffer.numberOfChannels > 1 ?
            audioBuffer.getChannelData(1) : undefined;
        const samples = this.width;
        const blockSize = Math.floor(primaryData.length / samples); // the number of samples in each subdivision
        const filteredData = [];
        for (let i = 0; i < samples; i++) {
            let blockStart = blockSize * i; // the location of the first sample in the block
            let sum = 0;
            for (let j = 0; j < blockSize; j++) {
                let channelValue = Math.abs(primaryData[blockStart + j]);
                // Get the max of both channels for stereo audio.
                if (secondaryData) {
                    channelValue = Math.max(channelValue, Math.abs(secondaryData[blockStart + j]));
                }

                sum += channelValue;  // find the sum of all the samples in the block
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