"use strict";
exports.__esModule = true;
exports.WaveformGraph = void 0;
var defines_1 = require("../lib/defines");
/**
 * Wave form graphic draw widget.
 */
var WaveformGraph = /** @class */ (function () {
    /**
     * Constructor.
     *
     * @param audioElement Input HTML element with source audio (HTML audio tag).
     * @param viewElement  The HTML element to render the widget.
     * @param options      The widget options.
     */
    function WaveformGraph(audioElement, viewElement, options) {
        this.audioElement = audioElement;
        this.viewElement = viewElement;
        this.options = options;
        this.isAudioContextInitialized = false;
        this.setOption(options);
        this.init();
    }
    WaveformGraph.prototype.setOption = function (options) {
        options = options || {};
        this.colorPositive = options.colorPositive || '#0f0';
        this.colorNegative = options.colorNegative || '#0a0';
        this.sourceChannel = options.sourceChannel;
    };
    WaveformGraph.prototype.init = function () {
        this.canvasElement = document.createElement('canvas');
        this.canvasContext = this.canvasElement.getContext('2d');
        this.viewElement.append(this.canvasElement);
        this.setSize();
        this.reset();
    };
    WaveformGraph.prototype.initAudio = function () {
        if (this.isAudioContextInitialized)
            return;
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)(); // Аудио контекст
        this.isAudioContextInitialized = true;
    };
    /**
     * Resets the graphic.
     */
    WaveformGraph.prototype.reset = function () {
        this.canvasContext.clearRect(0, 0, this.width, this.height);
    };
    /**
     * Updates the canvas size depended on element size.
     */
    WaveformGraph.prototype.resize = function () {
        this.setSize();
        this.createWaveForm(this.decodedBuffer);
    };
    /**
     * Draws waveform graphic.
     */
    WaveformGraph.prototype.render = function () {
        var _this = this;
        this.initAudio();
        fetch(this.audioElement.src)
            .then(function (response) { return response.arrayBuffer(); })
            .then(function (arrayBuffer) { return _this.audioContext.decodeAudioData(arrayBuffer); })
            .then(function (decodedBuffer) {
            _this.decodedBuffer = decodedBuffer;
            _this.createWaveForm(decodedBuffer);
        });
    };
    WaveformGraph.prototype.setSize = function () {
        this.width = this.viewElement.offsetWidth || defines_1.DEFAULT_WIDGET_WIDTH;
        this.height = this.viewElement.offsetHeight || defines_1.DEFAULT_WIDGET_HEIGHT;
        this.canvasElement.width = this.width;
        this.canvasElement.height = this.height;
    };
    WaveformGraph.prototype.filterData = function (audioBuffer) {
        var primaryData = audioBuffer.getChannelData(this.sourceChannel || 0); // primary channel data
        var secondaryData = this.sourceChannel === undefined && audioBuffer.numberOfChannels > 1 ?
            audioBuffer.getChannelData(1) : undefined;
        var samples = this.width;
        var blockSize = Math.floor(primaryData.length / samples); // the number of samples in each subdivision
        var filteredData = [];
        for (var i = 0; i < samples; i++) {
            var blockStart = blockSize * i; // the location of the first sample in the block
            var sum = 0;
            for (var j = 0; j < blockSize; j++) {
                var channelValue = Math.abs(primaryData[blockStart + j]);
                // Get the max of both channels for stereo audio.
                if (secondaryData) {
                    channelValue = Math.max(channelValue, Math.abs(secondaryData[blockStart + j]));
                }
                sum += channelValue; // find the sum of all the samples in the block
            }
            filteredData.push(sum / blockSize); // divide the sum by the block size to get the average
        }
        return filteredData;
    };
    WaveformGraph.prototype.drawSegment = function (x, y, width, isEven) {
        var height = isEven ? y : -y;
        this.canvasContext.fillStyle = isEven ? this.colorNegative : this.colorPositive;
        this.canvasContext.fillRect(x, this.height / 2, width, height);
    };
    ;
    WaveformGraph.prototype.createWaveForm = function (decodedBuffer) {
        this.reset();
        var data = this.filterData(decodedBuffer);
        var maxHeight = this.height;
        // draw the segments
        var width = this.width / data.length;
        for (var i = 0; i < data.length; i++) {
            var x = width * i;
            var height = data[i] * maxHeight;
            if (height < 0) {
                height = 0;
            }
            else if (height > maxHeight) {
                height = maxHeight;
            }
            this.drawSegment(x, height, width, !!((i + 1) % 2));
        }
    };
    return WaveformGraph;
}());
exports.WaveformGraph = WaveformGraph;
