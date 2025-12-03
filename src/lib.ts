/**
 * This is the entry point for the library.
 *
 * It exports all necessary classes, types, enums and interfaces.
 */

// Common definitions.
export {
  DEFAULT_WIDGET_WIDTH,
  DEFAULT_WIDGET_HEIGHT,
  DEFAULT_WIDGET_BACKGROUND_COLOR,
} from './common/defines';

// Utils.
export { Slider, SliderType } from './utils/slider';
export { mediaTimeToString } from './utils/media-time';
export { bounds } from './utils/bounds';
export { debounce } from './utils/debounce';

// Analyzers.
export { AbstractAnalyzer } from './common/abstract-analyzer';
export { AmplitudeAnalyzer } from './widgets/analyzers/amplitude-analyzer';
export { FrequencyAnalyzer } from './widgets/analyzers/frequency-analyzer';
export { WaveformAnalyzer } from './widgets/analyzers/waveform-analyzer';
export { WaveformGraph } from './widgets/analyzers/waveform-graph';

// Media components.
export { MediaState } from './widgets/media-player-components/media-state';
export {
  EnumMediaTimePointerMode,
  MediaTimePointer,
} from './widgets/media-player-components/media-time-pointer';
export { MediaTimerType, MediaTimer } from './widgets/media-player-components/media-timer';
export { MediaVolume } from './widgets/media-player-components/media-volume';

// Media player.
export {
  MediaPlayer,
  MediaType,
  TEMPLATE_HORIZONTAL_VOLUME_SLIDER,
  TEMPLATE_VERTICAL_VOLUME_SLIDER,
  TEMPLATE_WITH_HORIZONTAL_VOLUME_SLIDER,
  TEMPLATE_WITH_VERTICAL_VOLUME_SLIDER,
  TEMPLATE_WITHOUT_VOLUME_SLIDER,
} from './widgets/media-player/media-player';
export { MediaPlayerFactory } from './widgets/media-player/media-player-factory';

// Interfaces & types.
export type { IAbstractAnalyzerOptions, IAudioSource } from './common/abstract-analyzer';
export type { IAmplitudeAnalyzerOptions } from './widgets/analyzers/amplitude-analyzer';
export type { IMediaPlayerOptions } from './widgets/media-player/media-player';
export type { IMediaPlayerFactoryOptions } from './widgets/media-player/media-player-factory';
export type { IMediaTimerOptions } from './widgets/media-player-components/media-timer';
export type { IMediaTimePointerOptions } from './widgets/media-player-components/media-time-pointer';
export type { IMediaVolumeOptions } from './widgets/media-player-components/media-volume';
export type { IMediaStateOptions } from './widgets/media-player-components/media-state';
export type { IWaveFormGraphOptions } from './widgets/analyzers/waveform-graph';
export type { TMediaElements, TMediaSourcePreload } from './widgets/media-player/media-player';

// Deprecated.
export { AudioTimePointer } from './_deprecated/audio-time-pointer';
export { MediaPlayerList } from './_deprecated/media-player-list';
