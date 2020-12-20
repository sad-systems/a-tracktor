import { FrequencyAnalyzer } from './widgets/frequency-analyzer';
import { AmplitudeAnalyzer } from "./widgets/amplitude-analyzer";
import { WaveFormAnalyzer } from "./widgets/wave-form-analyzer";

const button = document.createElement('button');
button.append(document.createTextNode('Start Analyze'));
document.body.append(button);

let init = false;

button.onclick = () => {
    if (init) return;
    init = true;

    const audioElement = document.getElementById('audio2');
    const audioContext = new (window.AudioContext || (window).webkitAudioContext)(); // Аудио контекст
    const mediaSource  = audioContext.createMediaElementSource(audioElement);         // Источник аудио данных
    const splitter     = audioContext.createChannelSplitter(2);

    mediaSource.connect(audioContext.destination); // Подключаем к динамику для контроля
    mediaSource.connect(splitter);

    const f2 = new FrequencyAnalyzer(mediaSource); // , null, { fftSize: 32, color: '#00f' });
    const w1 = new WaveFormAnalyzer(mediaSource); // , null, { fftSize: 32, color: '#00f' });
    const a1 = new AmplitudeAnalyzer(splitter, null, { stereo: false, sourceChannel: 0 });
    const a2 = new AmplitudeAnalyzer(splitter, null, { stereo: false, sourceChannel: 1 });

    const f2view = f2.getViewElement();
    f2view.onclick = () => { audioElement.paused ? audioElement.play() : audioElement.pause(); };

    const a1view = a1.getViewElement();
    const a2view = a2.getViewElement();
    a1view.style.width = '20px';
    a1.resize();
    a2view.style.width = '20px';
    a2.resize();

    f2.start();
    w1.start();
    a1.start();
    a2.start();
    audioElement.play();
}
