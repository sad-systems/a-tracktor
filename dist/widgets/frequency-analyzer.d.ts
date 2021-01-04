/**
 * Frequency analyzer widget.
 *
 * ![](media://images/freq-widget.jpg)
 *
 * Example:
 * ```
 * const audioElement = document.getElementById('audio');
 * const viewElement = document.getElementById('div-analyzer');
 *
 * const f = new FrequencyAnalyzer(audioElement, viewElement, { fftSize: 256,  color: '#ffb21d' });
 *
 * // We can start only after user starts interact with our page.
 * // This is because of HTML Web Audio API restriction.
 * document.body.onclick = () => {
 *   audioElement.play();
 *   f.start();
 * }
 * ```
 *
 * @packageDocumentation
 */
import { AbstractAnalyzer } from '../lib/abstract-analyzer';
/**
 * Frequency analyzer widget.
 */
export declare class FrequencyAnalyzer extends AbstractAnalyzer {
    protected getDefaultColor(): string;
    /**
     * Draws frequency bar graph.
     */
    protected render: () => void;
}
