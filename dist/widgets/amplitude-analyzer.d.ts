/**
 * Amplitude analyzer widget.
 *
 * ![](media://images/amp-widget.jpg)
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
 * @packageDocumentation
 */
import { AbstractAnalyzer, IAbstractAnalyzerOptions } from '../lib/abstract-analyzer';
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
