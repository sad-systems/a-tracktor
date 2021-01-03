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
