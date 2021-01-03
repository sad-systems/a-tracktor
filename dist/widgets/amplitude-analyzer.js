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
exports.AmplitudeAnalyzer = void 0;
var abstract_analyzer_1 = require("../lib/abstract-analyzer");
/**
 * Amplitude analyzer widget.
 */
var AmplitudeAnalyzer = /** @class */ (function (_super) {
    __extends(AmplitudeAnalyzer, _super);
    function AmplitudeAnalyzer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * Draws amplitude level graph.
         */
        _this.render = function () {
            _this.requestAniFrameID = requestAnimationFrame(_this.render);
            _this.clear();
            if (_this.stereo) {
                _this.drawLevel(_this.analyser, 0, _this.width / 2 - 1, 0, _this.height);
                _this.drawLevel(_this.analyser2, _this.width / 2, _this.width / 2 - 1, 0, _this.height);
            }
            else {
                _this.drawLevel(_this.analyser, 0, _this.width, 0, _this.height);
            }
            _this.digitizeLevel(0, _this.width, 0, _this.height);
        };
        return _this;
    }
    AmplitudeAnalyzer.prototype.getDefaultFftSize = function () {
        return 2048;
    };
    AmplitudeAnalyzer.prototype.setOption = function (options) {
        _super.prototype.setOption.call(this, options);
        options = options || {};
        this.colorClip = options.colorClip || '#f00';
        this.colorWarn = options.colorWarn || '#ff0';
        this.colorNorm = options.colorNorm || '#0f0';
        this.valueClip = options.valueClip === undefined ? 0.9 : options.valueClip;
        this.valueWarn = options.valueWarn === undefined ? 0.8 : options.valueWarn;
        this.barSize = options.barSize === undefined ? 5 : options.barSize;
        this.stereo = options.stereo === undefined ? true : options.stereo;
        this.fillStyle = options.fillStyle;
    };
    AmplitudeAnalyzer.prototype.createAnalyzer = function () {
        this.analyser = this.audioContext.createAnalyser(); // Создание анализатора сигнала первого канала (левого)
        if (this.stereo) {
            var splitter = this.audioContext.createChannelSplitter(2); // Создание разделителя каналов.
            this.mediaSource.connect(splitter);
            this.analyser2 = this.audioContext.createAnalyser(); // Создание анализатора сигнала второго канала (правого)
            splitter.connect(this.analyser, 0); // Left channel
            splitter.connect(this.analyser2, 1); // Right channel
        }
        else {
            this.mediaSource.connect(this.analyser, this.sourceChannel);
        }
    };
    AmplitudeAnalyzer.prototype.getStyle = function () {
        if (!this.fillStyle) {
            this.fillStyle = this.canvasContext.createLinearGradient(0, this.height, 0, 0);
            this.fillStyle.addColorStop(0, this.colorNorm);
            this.fillStyle.addColorStop(this.valueWarn, this.colorWarn);
            this.fillStyle.addColorStop(this.valueClip, this.colorClip);
        }
        return this.fillStyle;
    };
    /**
     * Creates measurement dividing bars.
     *
     * @param x
     * @param width
     * @param y
     * @param height
     */
    AmplitudeAnalyzer.prototype.digitizeLevel = function (x, width, y, height) {
        for (var i = y + 1; i < height; i++) {
            this.canvasContext.clearRect(x, i * this.barSize, width, 1);
        }
    };
    /**
     * Draws amplitude level for the given analyzer.
     *
     * @param analyser
     * @param x
     * @param width
     * @param y
     * @param height
     */
    AmplitudeAnalyzer.prototype.drawLevel = function (analyser, x, width, y, height) {
        analyser.getByteTimeDomainData(this.dataArray);
        var maxValue = Math.max.apply(Math, Array.from(this.dataArray));
        var barHeight = (maxValue / 128) * height;
        this.canvasContext.fillStyle = this.getStyle();
        this.canvasContext.fillRect(x, height, width, height - barHeight);
    };
    return AmplitudeAnalyzer;
}(abstract_analyzer_1.AbstractAnalyzer));
exports.AmplitudeAnalyzer = AmplitudeAnalyzer;
