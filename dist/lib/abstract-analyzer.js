"use strict";
exports.__esModule = true;
exports.AbstractAnalyzer = void 0;
var defines_1 = require("./defines");
/**
 * Abstract analyzer widget.
 *
 * This class is the basic class to inherit and implement other widgets.
 */
var AbstractAnalyzer = /** @class */ (function () {
    /**
     * Constructor.
     *
     * @param audioSource Input HTML element with source audio (HTML audio tag) or structure of IAudioSource.
     * @param viewElement The HTML element to render the widget. Will be auto created if it is undefined or null.
     * @param options     Analyzer options.
     */
    function AbstractAnalyzer(audioSource, viewElement, options) {
        this.isAudioContextInitialized = false;
        this.setAudioSource(audioSource);
        this.setViewElement(viewElement);
        this.setOption(options);
        this.initView();
    }
    /**
     * Starts rendering.
     */
    AbstractAnalyzer.prototype.start = function () {
        this.initAudio();
        this.initAnalyzer();
        this.render();
    };
    /**
     * Pauses rendering.
     */
    AbstractAnalyzer.prototype.pause = function () {
        cancelAnimationFrame(this.requestAniFrameID);
    };
    /**
     * Stops rendering.
     */
    AbstractAnalyzer.prototype.stop = function () {
        cancelAnimationFrame(this.requestAniFrameID);
        this.clear();
    };
    /**
     * Updates the canvas size depended on the [[constructor|viewElement]] size.
     */
    AbstractAnalyzer.prototype.resize = function () {
        this.width = this.viewElement.offsetWidth || defines_1.DEFAULT_WIDGET_WIDTH;
        this.height = this.viewElement.offsetHeight || defines_1.DEFAULT_WIDGET_HEIGHT;
        this.canvasElement.width = this.width;
        this.canvasElement.height = this.height;
    };
    /**
     * Clears the canvas.
     */
    AbstractAnalyzer.prototype.clear = function () {
        this.canvasContext.clearRect(0, 0, this.width, this.height);
    };
    /**
     * Returns the audio source structure for this instance.
     */
    AbstractAnalyzer.prototype.getAudioSource = function () {
        return {
            audioContext: this.audioContext,
            audioElement: this.audioElement,
            mediaSource: this.mediaSource
        };
    };
    /**
     * Returns the ViewElement for this instance.
     */
    AbstractAnalyzer.prototype.getViewElement = function () {
        return this.viewElement;
    };
    AbstractAnalyzer.prototype.getDefaultFftSize = function () {
        return 256;
    };
    AbstractAnalyzer.prototype.getDefaultColor = function () {
        return '#fff';
    };
    AbstractAnalyzer.prototype.getDefaultViewElement = function () {
        var div = document.createElement('div');
        div.style.width = defines_1.DEFAULT_WIDGET_WIDTH + 'px';
        div.style.height = defines_1.DEFAULT_WIDGET_HEIGHT + 'px';
        div.style.backgroundColor = defines_1.DEFAULT_WIDGET_BACKGROUND_COLOR;
        document.body.append(div);
        return div;
    };
    AbstractAnalyzer.prototype.setOption = function (options) {
        options = options || {};
        this.fftSize = options.fftSize || this.getDefaultFftSize();
        this.color = AbstractAnalyzer.normalizeColor(options.color || this.getDefaultColor());
        this.sourceChannel = options.sourceChannel || 0;
        this.connectDestination = options.connectDestination === undefined ? true : options.connectDestination;
    };
    AbstractAnalyzer.prototype.setViewElement = function (viewElement) {
        this.viewElement = viewElement || this.getDefaultViewElement();
    };
    AbstractAnalyzer.prototype.setAudioSource = function (audioSource) {
        if (audioSource) {
            if (audioSource instanceof HTMLMediaElement) {
                this.audioElement = audioSource;
            }
            else {
                this.mediaSource = audioSource;
            }
        }
        if (!this.audioElement) {
            this.audioElement = document.createElement('audio');
            // document.body.append(this.audioElement);
        }
    };
    AbstractAnalyzer.prototype.initView = function () {
        this.viewElement = this.viewElement || this.getDefaultViewElement();
        this.canvasElement = document.createElement('canvas');
        this.canvasContext = this.canvasElement.getContext('2d');
        this.viewElement.append(this.canvasElement);
        this.resize();
        this.clear();
    };
    AbstractAnalyzer.prototype.initAudio = function () {
        if (this.isAudioContextInitialized)
            return;
        if (this.mediaSource) {
            this.audioContext = this.mediaSource.context;
        }
        else {
            var audioSource = AbstractAnalyzer.createAudioSourceForElement(this.audioElement, this.connectDestination);
            this.audioContext = audioSource.audioContext;
            this.mediaSource = audioSource.mediaSource;
        }
        this.createAnalyzer();
        this.isAudioContextInitialized = true;
    };
    AbstractAnalyzer.prototype.createAnalyzer = function () {
        this.analyser = this.audioContext.createAnalyser(); // Создание анализатора сигнала
        this.mediaSource.connect(this.analyser, this.sourceChannel); // Соединение анализатора с каналом источника данных
    };
    AbstractAnalyzer.prototype.initAnalyzer = function () {
        this.analyser.fftSize = this.fftSize;
        this.bufferLength = this.analyser.frequencyBinCount; // console.log('bufferLength:', this.bufferLength);
        this.dataArray = new Uint8Array(this.bufferLength);
    };
    AbstractAnalyzer.createAudioSourceForElement = function (audioElement, connectDestination) {
        var audioSource = AbstractAnalyzer.findAudioSourceByElement(audioElement);
        if (!audioSource) {
            var audioContext = new (window.AudioContext || window.webkitAudioContext)(); // Аудио контекст
            var mediaSource = audioContext.createMediaElementSource(audioElement); // Источник аудио данных
            if (connectDestination) {
                mediaSource.connect(audioContext.destination); // Соединение с приёмником аудио данных
            }
            audioSource = {
                audioElement: audioElement,
                audioContext: audioContext,
                mediaSource: mediaSource
            };
            AbstractAnalyzer.audioSources.push(audioSource);
        }
        return audioSource;
    };
    AbstractAnalyzer.findAudioSourceByElement = function (audioElement) {
        return AbstractAnalyzer.audioSources.find(function (audioSource) { return audioSource.audioElement === audioElement; });
    };
    /**
     * Converts short format color '#abc' to long format color: '#aabbcc'.
     *
     * @param color
     */
    AbstractAnalyzer.normalizeColor = function (color) {
        return color.replace(/^#(\w)(\w)(\w)$/, '#$1$1$2$2$3$3');
    };
    AbstractAnalyzer.audioSources = [];
    return AbstractAnalyzer;
}());
exports.AbstractAnalyzer = AbstractAnalyzer;
