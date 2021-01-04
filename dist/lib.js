"use strict";
exports.__esModule = true;
exports.WaveformGraph = exports.WaveformAnalyzer = exports.FrequencyAnalyzer = exports.AmplitudeAnalyzer = exports.AbstractAnalyzer = void 0;
/**
 * This is the entry point for the library.
 *
 * It exports all necessary classes.
 *
 * @packageDocumentation
 * @module a-tracktor
 */
var abstract_analyzer_1 = require("./lib/abstract-analyzer");
exports.AbstractAnalyzer = abstract_analyzer_1.AbstractAnalyzer;
var amplitude_analyzer_1 = require("./widgets/amplitude-analyzer");
exports.AmplitudeAnalyzer = amplitude_analyzer_1.AmplitudeAnalyzer;
var frequency_analyzer_1 = require("./widgets/frequency-analyzer");
exports.FrequencyAnalyzer = frequency_analyzer_1.FrequencyAnalyzer;
var waveform_analyzer_1 = require("./widgets/waveform-analyzer");
exports.WaveformAnalyzer = waveform_analyzer_1.WaveformAnalyzer;
var waveform_graph_1 = require("./widgets/waveform-graph");
exports.WaveformGraph = waveform_graph_1.WaveformGraph;
