import { AbstractAnalyzer } from '../lib/abstract-analyzer';
/**
 * Wave form analyzer widget.
 */
export declare class WaveformAnalyzer extends AbstractAnalyzer {
    protected getDefaultFftSize(): number;
    protected getDefaultColor(): string;
    /**
     * Draws waveform/oscilloscope graph.
     */
    protected render: () => void;
}
