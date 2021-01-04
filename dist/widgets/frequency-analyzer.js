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
exports.FrequencyAnalyzer = void 0;
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
 * @packageDocumentation
 */
var abstract_analyzer_1 = require("../lib/abstract-analyzer");
/**
 * Frequency analyzer widget.
 */
var FrequencyAnalyzer = /** @class */ (function (_super) {
    __extends(FrequencyAnalyzer, _super);
    function FrequencyAnalyzer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * Draws frequency bar graph.
         */
        _this.render = function () {
            _this.requestAniFrameID = requestAnimationFrame(_this.render);
            _this.analyser.getByteFrequencyData(_this.dataArray); // b[k]= 0 ... 255 // https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/getByteFrequencyData
            _this.clear();
            var barWidth = (_this.width / _this.bufferLength);
            var x = 0;
            for (var i = 0; i < _this.bufferLength; i++) {
                var barHeight = _this.dataArray[i] / 255 * _this.height;
                var opacity = _this.dataArray[i].toString(16); // Convert to hex
                _this.canvasContext.fillStyle = _this.color + opacity;
                _this.canvasContext.fillRect(x, _this.height - barHeight, barWidth, _this.height);
                x += barWidth + 1;
            }
        };
        return _this;
    }
    FrequencyAnalyzer.prototype.getDefaultColor = function () {
        return '#f33';
    };
    return FrequencyAnalyzer;
}(abstract_analyzer_1.AbstractAnalyzer));
exports.FrequencyAnalyzer = FrequencyAnalyzer;
