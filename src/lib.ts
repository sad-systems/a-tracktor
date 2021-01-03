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
