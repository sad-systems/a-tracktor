"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.WaveformAnalyzer = void 0;
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
var abstract_analyzer_1 = require("../lib/abstract-analyzer");
/**
 * Waveform analyzer widget.
 */
var WaveformAnalyzer = /** @class */ (function (_super) {
    __extends(WaveformAnalyzer, _super);
    function WaveformAnalyzer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * Draws waveform/oscilloscope graph.
         */
        _this.render = function () {
            _this.requestAniFrameID = requestAnimationFrame(_this.render);
            _this.analyser.getByteTimeDomainData(_this.dataArray);
            _this.clear();
            _this.canvasContext.lineWidth = 1;
            _this.canvasContext.strokeStyle = _this.color;
            _this.canvasContext.beginPath();
            var stepWidth = _this.width / _this.bufferLength;
            var x = 0;
            for (var i = 0; i < _this.bufferLength; i++) {
                var y = _this.dataArray[i] / 128 * (_this.height / 2); // b[k]=|128(1+x[k])|. Where x[k] is time-domain data. b[k] is the byte value,
                i == 0 ? _this.canvasContext.moveTo(x, y) : _this.canvasContext.lineTo(x, y);
                x += stepWidth;
            }
            _this.canvasContext.lineTo(_this.width, _this.height / 2);
            _this.canvasContext.stroke();
        };
        return _this;
    }
    WaveformAnalyzer.prototype.getDefaultFftSize = function () {
        return 2048;
    };
    WaveformAnalyzer.prototype.getDefaultColor = function () {
        return '#fff';
    };
    return WaveformAnalyzer;
}(abstract_analyzer_1.AbstractAnalyzer));
exports.WaveformAnalyzer = WaveformAnalyzer;
