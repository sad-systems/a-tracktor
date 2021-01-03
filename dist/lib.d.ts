import { AbstractAnalyzer as ClassAbstractAnalyzer } from './lib/abstract-analyzer';
import { AmplitudeAnalyzer } from './widgets/amplitude-analyzer';
import { FrequencyAnalyzer } from './widgets/frequency-analyzer';
import { WaveformAnalyzer } from './widgets/waveform-analyzer';
import { WaveformGraph } from './widgets/waveform-graph';
declare const _default: {
    AmplitudeAnalyzer: typeof AmplitudeAnalyzer;
    FrequencyAnalyzer: typeof FrequencyAnalyzer;
    WaveformAnalyzer: typeof WaveformAnalyzer;
    WaveformGraph: typeof WaveformGraph;
};
/**
 * Widgets.
 */
export default _default;
/**
 * Abstract analyzer to extend.
 */
export declare const AbstractAnalyzer: typeof ClassAbstractAnalyzer;
