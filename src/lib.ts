/**
 * This is the entry point for the library.
 *
 * It exports all necessary classes.
 */
import {
  DEFAULT_WIDGET_WIDTH,
  DEFAULT_WIDGET_HEIGHT,
  DEFAULT_WIDGET_BACKGROUND_COLOR,
} from './common/defines';
import { AbstractAnalyzer } from './common/abstract-analyzer';
import { AmplitudeAnalyzer } from './widgets/analyzers/amplitude-analyzer';
import { FrequencyAnalyzer } from './widgets/analyzers/frequency-analyzer';
import { WaveformAnalyzer } from './widgets/analyzers/waveform-analyzer';
import { WaveformGraph } from './widgets/analyzers/waveform-graph';
import { AudioTimePointer } from './_deprecated/audio-time-pointer';
import { Slider } from './utils/slider';
import { mediaTimeToString } from './utils/media-time';
import { bounds } from './utils/bounds';
import { debounce } from './utils/debounce';
import { MediaState } from './widgets/media-player-components/media-state';
import { MediaTimePointer } from './widgets/media-player-components/media-time-pointer';
import { MediaTimer } from './widgets/media-player-components/media-timer';
import { MediaVolume } from './widgets/media-player-components/media-volume';
import { MediaPlayer } from './widgets/media-player/media-player';
import { MediaPlayerList } from './widgets/media-player/media-player-list';

export {
  // Definitions.
  DEFAULT_WIDGET_WIDTH,
  DEFAULT_WIDGET_HEIGHT,
  DEFAULT_WIDGET_BACKGROUND_COLOR,
  // Analyzers.
  AbstractAnalyzer,
  AmplitudeAnalyzer,
  FrequencyAnalyzer,
  WaveformAnalyzer,
  WaveformGraph,
  AudioTimePointer,
  // Utils.
  mediaTimeToString,
  bounds,
  debounce,
  Slider,
  // Media components.
  MediaState,
  MediaTimePointer,
  MediaTimer,
  MediaVolume,
  // Media player.
  MediaPlayer,
  MediaPlayerList,
};
