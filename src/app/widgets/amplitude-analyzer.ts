import { AbstractAnalyzer, IAbstractAnalyzerOptions } from './abstract-analyzer';

/**
 * Options for the Amplitude analyzer.
 */
export interface IAmplitudeAnalyzerOptions extends IAbstractAnalyzerOptions {
    colorClip?: string;
    colorWarn?: string;
    colorNorm?: string;
    valueClip?: number;
    valueWarn?: number;
    barSize?: number;
    stereo?: boolean;
    fillStyle?: string | CanvasGradient | CanvasPattern;
}

/**
 * Amplitude analyzer widget.
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

    protected setOption(options?: IAmplitudeAnalyzerOptions) {
        super.setOption(options);

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

            splitter.connect(this.analyser, 0);  // Left channel
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
            this.drawLevel(this.analyser2, this.width / 2 /*+ 1*/, this.width / 2 - 1, 0, this.height);
        } else {
            this.drawLevel(this.analyser, 0, this.width, 0, this.height);
        }

        this.digitizeLevel(0, this.width, 0, this.height);
    }

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