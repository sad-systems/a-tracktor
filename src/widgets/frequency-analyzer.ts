import { AbstractAnalyzer } from '../lib/abstract-analyzer';

/**
 * Frequency analyzer widget.
 */
export class FrequencyAnalyzer extends AbstractAnalyzer {

    protected getDefaultColor(): string {
        return '#f33';
    }

    /**
     * Draws frequency bar graph.
     */
    protected render = () => {
        this.requestAniFrameID = requestAnimationFrame(this.render);

        this.analyser.getByteFrequencyData(this.dataArray); // b[k]= 0 ... 255 // https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/getByteFrequencyData

        this.clear();

        const barWidth = (this.width / this.bufferLength);
        let x = 0;

        for (let i = 0; i < this.bufferLength; i++) {
            const barHeight = this.dataArray[i] / 255 * this.height;
            const opacity = this.dataArray[i].toString(16); // Convert to hex

            this.canvasContext.fillStyle = this.color + opacity;
            this.canvasContext.fillRect(x, this.height - barHeight, barWidth, this.height);

            x += barWidth + 1;
        }
    }
}