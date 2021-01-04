/**
 * Waveform analyzer widget.
 *
 * ![](media://images/wave-widget.jpg)
 *
 * Example:
 * ```
 * const audioElement = document.getElementById('audio');
 * const viewElement = document.getElementById('div-analyzer');
 *
 * const w = new WaveformAnalyzer(audioElement, viewElement, { color: '#00ff00' });
 *
 * // We can start only after user starts interact with our page.
 * // This is because of HTML Web Audio API restriction.
 * document.body.onclick = () => {
 *   audioElement.play();
 *   w.start();
 * }
 * ```
 *
 * @packageDocumentation
 */
import { AbstractAnalyzer } from '../lib/abstract-analyzer';
/**
 * Waveform analyzer widget.
 */
export declare class WaveformAnalyzer extends AbstractAnalyzer {
    protected getDefaultFftSize(): number;
    protected getDefaultColor(): string;
    /**
     * Draws waveform/oscilloscope graph.
     */
    protected render: () => void;
}
