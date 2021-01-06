import * as _ from 'lodash';

import { FrequencyAnalyzer } from '../widgets/frequency-analyzer';
import { WaveformAnalyzer } from '../widgets/waveform-analyzer';
import { WaveformGraph } from '../widgets/waveform-graph';
import { AmplitudeAnalyzer } from '../widgets/amplitude-analyzer';
import { AudioTimePointer } from "../widgets/audio-time-pointer";

/**
 * Demo unit.
 */

// Control elements

const audioElement = document.getElementById('audio');
const playBtnElement = document.getElementById('play');
const stopBtnElement = document.getElementById('stop');

const viewElement1 = document.getElementById('analyzer1');
const viewElement2 = document.getElementById('analyzer2');
const viewElement3 = document.getElementById('wavegraph1');
const viewElement4 = document.getElementById('analyzer3');

export const f = new FrequencyAnalyzer(audioElement, viewElement1, { /*fftSize: 32,*/ color: '#ffb21d' });
export const w = new WaveformAnalyzer(audioElement, viewElement2, { color: '#00ff00' });
export const a = new AmplitudeAnalyzer(audioElement, viewElement4, { colorClip: '#f00' });
export const waveFormGraph = new WaveformGraph(audioElement, viewElement3,
    { colorPositive: '#00daff', colorNegative: '#00b6d5' });

waveFormGraph.render();

// Graphical cursor

const audioTimePointer = new AudioTimePointer(audioElement, viewElement3,
    { mode: 'bar', pointerStyle: { background: '#0f0a', width: '2px' }, /*pointerClass: 'time-pointer'*/ });

// Analyzers resizer

function resize() {
    f.resize();
    w.resize();
    a.resize();
    waveFormGraph.resize();
    audioTimePointer.resize();
}

window.addEventListener('resize', _.debounce(resize, 250));

const audioList = document.querySelectorAll('.js-audio');

for (let audioItem of audioList)
    audioItem.addEventListener('click', (event) => {
        const fileName = event.target.getAttribute('data-file');
        audioElement.src = fileName;
        waveFormGraph.render();
        audioElement.play();
    });

// Analyzers controls

const play = () => {
    f.start();
    w.start();
    a.start();
}
const pause = () => {
    f.pause();
    w.pause();
    a.pause();
}
export const stop = () => {
    f.stop();
    w.stop();
    a.stop();
    audioElement.currentTime = 0;
}

playBtnElement.onclick = () => { audioElement.paused ? audioElement.play() : audioElement.pause(); }
stopBtnElement.onclick = () => { audioElement.pause(); stop(); }

audioElement.onplay = play;
audioElement.onpause = pause;
audioElement.onended = stop;
