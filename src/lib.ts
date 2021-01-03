/**
 * This is the entry point for the library.
 *
 * Example:
 * ```
 * import Widgets from '@sad-systems/a-tracktor';
 *
 * const audioElement = document.getElementById('audio');
 * const viewElement = document.getElementById('div-analyzer');
 * const playBtnElement = document.getElementById('btn-play');
 *
 * const f = new Widgets.FrequencyAnalyzer(audioElement, viewElement, { color: '#ffb21d' });
 *
 * playBtnElement.onclick = () => {
 *   if (audioElement.paused) {
 *       f.start();
 *       audioElement.play();
 *   } else {
 *       f.stop();
 *       audioElement.pause();
 *   }
 * }
 * ```
 *
 * @packageDocumentation
 * @module a-tracktor
 */
import { AbstractAnalyzer as ClassAbstractAnalyzer } from './lib/abstract-analyzer';

import { AmplitudeAnalyzer } from './widgets/amplitude-analyzer';
import { FrequencyAnalyzer } from './widgets/frequency-analyzer';
import { WaveformAnalyzer } from './widgets/waveform-analyzer';
import { WaveformGraph } from './widgets/waveform-graph';

/**
 * Widgets.
 */
export default {
    AmplitudeAnalyzer: AmplitudeAnalyzer,
    FrequencyAnalyzer: FrequencyAnalyzer,
    WaveformAnalyzer: WaveformAnalyzer,
    WaveformGraph: WaveformGraph
}

/**
 * Abstract analyzer to extend.
 */
export const AbstractAnalyzer = ClassAbstractAnalyzer;
