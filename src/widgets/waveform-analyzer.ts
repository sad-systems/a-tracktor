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
export class WaveformAnalyzer extends AbstractAnalyzer {

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