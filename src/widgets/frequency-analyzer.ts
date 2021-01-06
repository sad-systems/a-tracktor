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
 * See more options at interface definition: {@link IAbstractAnalyzerOptions}
 *
 * @packageDocumentation
 */
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