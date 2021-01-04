/**
 * This is the entry point for the library.
 *
 * It exports all necessary classes.
 *
 * @packageDocumentation
 * @module a-tracktor
 */
import { AbstractAnalyzer } from './lib/abstract-analyzer';
import { AmplitudeAnalyzer } from './widgets/amplitude-analyzer';
import { FrequencyAnalyzer } from './widgets/frequency-analyzer';
import { WaveformAnalyzer } from './widgets/waveform-analyzer';
import { WaveformGraph } from './widgets/waveform-graph';

export {
    AbstractAnalyzer,
    AmplitudeAnalyzer,
    FrequencyAnalyzer,
    WaveformAnalyzer,
    WaveformGraph,
};
