import { AbstractAnalyzer, IAbstractAnalyzerOptions } from '../lib/abstract-analyzer';
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
export declare class AmplitudeAnalyzer extends AbstractAnalyzer {
    protected analyser2: AnalyserNode;
    protected colorClip: string;
    protected colorWarn: string;
    protected colorNorm: string;
    protected valueClip: number;
    protected valueWarn: number;
    protected barSize: number;
    protected stereo: boolean;
    protected fillStyle: string | CanvasGradient | CanvasPattern;
    protected getDefaultFftSize(): number;
    protected setOption(options?: IAmplitudeAnalyzerOptions): void;
    protected createAnalyzer(): void;
    protected getStyle(): string | CanvasGradient | CanvasPattern;
    /**
     * Creates measurement dividing bars.
     *
     * @param x
     * @param width
     * @param y
     * @param height
     */
    protected digitizeLevel(x: number, width: number, y: number, height: number): void;
    /**
     * Draws amplitude level graph.
     */
    protected render: () => void;
    /**
     * Draws amplitude level for the given analyzer.
     *
     * @param analyser
     * @param x
     * @param width
     * @param y
     * @param height
     */
    protected drawLevel(analyser: AnalyserNode, x: number, width: number, y: number, height: number): void;
}
