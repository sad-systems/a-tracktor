import { AbstractAnalyzer } from '../lib/abstract-analyzer';

/**
 * Wave form analyzer widget.
 */
export class WaveFormAnalyzer extends AbstractAnalyzer {

    protected getDefaultFftSize(): number {
        return 2048;
    }

    protected getDefaultColor(): string {
        return '#fff';
    }

    /**
     * Draws waveform/oscilloscope graph.
     */
    protected render = () => {
        this.requestAniFrameID = requestAnimationFrame(this.render);

        this.analyser.getByteTimeDomainData(this.dataArray);

        this.clear();

        this.canvasContext.lineWidth = 1;
        this.canvasContext.strokeStyle = this.color;
        this.canvasContext.beginPath();

        const stepWidth = this.width / this.bufferLength;
        let x = 0;

        for (var i = 0; i < this.bufferLength; i++) {
            const y = this.dataArray[i] / 128 * (this.height / 2); // b[k]=|128(1+x[k])|. Where x[k] is time-domain data. b[k] is the byte value,

            i == 0 ? this.canvasContext.moveTo(x, y) : this.canvasContext.lineTo(x, y);

            x += stepWidth;
        }

        this.canvasContext.lineTo(this.width, this.height / 2);
        this.canvasContext.stroke();
    }
}