"use strict";
exports.__esModule = true;
exports.AbstractAnalyzer = void 0;
var abstract_analyzer_1 = require("./lib/abstract-analyzer");
var amplitude_analyzer_1 = require("./widgets/amplitude-analyzer");
var frequency_analyzer_1 = require("./widgets/frequency-analyzer");
var waveform_analyzer_1 = require("./widgets/waveform-analyzer");
var waveform_graph_1 = require("./widgets/waveform-graph");
/**
 * Widgets.
 */
exports["default"] = {
    AmplitudeAnalyzer: amplitude_analyzer_1.AmplitudeAnalyzer,
    FrequencyAnalyzer: frequency_analyzer_1.FrequencyAnalyzer,
    WaveformAnalyzer: waveform_analyzer_1.WaveformAnalyzer,
    WaveformGraph: waveform_graph_1.WaveformGraph
};
/**
 * Abstract analyzer to extend.
 */
exports.AbstractAnalyzer = abstract_analyzer_1.AbstractAnalyzer;
