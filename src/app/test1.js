import { FrequencyAnalyzer } from '../widgets/frequency-analyzer';

const f2 = new FrequencyAnalyzer(); // , null, { fftSize: 32, color: '#00f' });
const f2audio = f2.getAudioSource().audioElement;
const f2view = f2.getViewElement();
f2audio.src = 'assets/test-melody.mp3';
f2view.onclick = () => {
    if (f2audio.paused) {
        f2.start();
        f2audio.play()
    } else {
        f2.pause();
        f2audio.pause();
    }
};
