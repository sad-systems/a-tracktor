/**
 * Analyze microphone signal demo
 */

import { FrequencyAnalyzer } from '../widgets/frequency-analyzer';
import { WaveformAnalyzer } from '../widgets/waveform-analyzer';
import { AmplitudeAnalyzer } from '../widgets/amplitude-analyzer';

navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

const viewElement1 = document.getElementById('mic-analyzer1');
const viewElement2 = document.getElementById('mic-analyzer2');
const viewElement3 = document.getElementById('mic-analyzer3');
const buttonMic    = document.getElementById('button-mic');
const iconMic      = document.getElementById('icon-mic');

let audioContext;
let micStream;
let f1 = new FrequencyAnalyzer(null, viewElement1);
let w1 = new WaveformAnalyzer(null, viewElement2);
let a1 = new AmplitudeAnalyzer(null, viewElement3);

buttonMic.onclick = () => (!micStream || !micStream.active ? startMicSession() : stopMicSession());

/**
 * Starts analyze the microphone
 */
const startMicSession = () => {

    if (!navigator.getUserMedia) {
        if (confirm('Microphone usage is denied on HTTP protocol, so lets try to switch in HTTPS ?')) {
            location.replace(location.href.replace(/^http:/, 'https:'));
        }
    }

    navigator.getUserMedia(
        { audio: true, video: false },
        (stream) => {
            micStream = stream;
            console.log('Microphone is ON');
            iconMic.className = "microphone on media-controls-icon-volume-high";

            audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
            const mediaSource = audioContext.createMediaStreamSource(stream);

            f1.changeAudioSource(mediaSource);
            w1.changeAudioSource(mediaSource);
            a1.changeAudioSource(mediaSource);

            startAnalyzers();
        },
        (error) => {
            console.log('Error:', error.message);
        }
    );
}

/**
 * Stops analyze the microphone
 */
const stopMicSession = () => {
    if (micStream) {
        micStream.getTracks().map(track => track.stop());
        console.log('Microphone is OFF');
        iconMic.className = "microphone off media-controls-icon-volume-mute";
    }
    stopAnalyzers();
}

const startAnalyzers = () => {
    f1 && f1.start();
    w1 && w1.start();
    a1 && a1.start();
}

const stopAnalyzers = () => {
    f1 && f1.stop();
    w1 && w1.stop();
    a1 && a1.stop();
}