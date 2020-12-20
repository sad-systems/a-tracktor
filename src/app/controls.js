// Control elements

import { FrequencyAnalyzer } from './widgets/frequency-analyzer';
import { WaveFormAnalyzer } from './widgets/wave-form-analyzer';
import { WaveFormGraph } from './widgets/wave-form-graph';
import { AmplitudeAnalyzer } from './widgets/amplitude-analyzer';

const audioElement = document.getElementById('audio');
const playElement = document.getElementById('play');
const stopElement = document.getElementById('stop');

const viewElement1 = document.getElementById('analyzer1');
const viewElement2 = document.getElementById('analyzer2');
const viewElement3 = document.getElementById('wavegraph1');
const viewElement4 = document.getElementById('analyzer3');
const posElement = viewElement3;

const f = new FrequencyAnalyzer(audioElement, viewElement1, { fftSize: 32, color: '#00f' });
const w = new WaveFormAnalyzer(audioElement, viewElement2, { color: '#00f' });
const a = new AmplitudeAnalyzer(audioElement, viewElement4, { colorClip: '#00f' });
export const waveFormGraph = new WaveFormGraph(audioElement, viewElement3);

const f2 = new FrequencyAnalyzer(audioElement); // , null, { fftSize: 32, color: '#00f' });

waveFormGraph.render();

const play = () => { console.log('play'); f.start(); w.start(); a.start(); f2.start(); return true; }
const pause = () => { console.log('pause');  f.pause(); w.pause(); a.pause(); f2.pause(); return true; }
export const stop = () => { console.log('stop');  f.stop(); w.stop(); a.stop(); f2.stop(); audioElement.currentTime = 0; return true; }

const cursor = document.createElement('div');
cursor.style.backgroundColor = '#fff7';
cursor.style.width = '1px';
cursor.style.height = posElement.offsetHeight;
cursor.style.position = 'absolute';
cursor.style.top = 0;
cursor.style.left = 0;

posElement.append(cursor);

playElement.onclick = () => { audioElement.paused ? audioElement.play() : audioElement.pause(); }
stopElement.onclick = () => { audioElement.pause(); stop(); }

posElement.onclick = (event) => {
    const duration = audioElement.duration;
    const width = posElement.offsetWidth;
    const pos = duration * event.offsetX / width;

    audioElement.currentTime = pos;
}

audioElement.onplay = play;
// audioElement.onplaying = play;
audioElement.onpause = pause;
audioElement.onended = stop;
audioElement.ontimeupdate = () => {
    const pos =  audioElement.currentTime * posElement.offsetWidth / audioElement.duration;

    cursor.style.left = pos;
}
