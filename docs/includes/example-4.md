### Example 4

Using multiple analyzers for the same dedicated audio source.

HTML:
```HTML
<body>
    <audio id="audio" src="some-audio-file.mp3"></audio>
    <button id="btn-play">Play/Pause</button>
</body>

```

Javascript:
```javascript
import { FrequencyAnalyzer, WaveformAnalyzer, AmplitudeAnalyzer } from '@sad-systems/a-tracktor';

const playBtnElement = document.getElementById('btn-play');

let init = false;

playBtnElement.onclick = () => {

    // This section should be used only once
    if (!init) {
        init = true;

        // Create single audio source
        const audioElement = document.getElementById('audio');
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const mediaSource = audioContext.createMediaElementSource(audioElement);
        // Create splitter for two channels audio
        const splitter = audioContext.createChannelSplitter(2);

        // Connect the source to speakers to control
        mediaSource.connect(audioContext.destination);
        // Connect audio splitter
        mediaSource.connect(splitter);

        // Create analyzers for the same audio source
        const f1 = new FrequencyAnalyzer(mediaSource);
        const w1 = new WaveformAnalyzer(mediaSource);
        // Create two separete analysers for channels
        const a1 = new AmplitudeAnalyzer(splitter, null, { stereo: false, sourceChannel: 0 });
        const a2 = new AmplitudeAnalyzer(splitter, null, { stereo: false, sourceChannel: 1 });

        // Styling the analyzers views
        const a1view = a1.getViewElement();
        const a2view = a2.getViewElement();
        a1view.style.width = '20px';
        a1.resize();
        a2view.style.width = '20px';
        a2.resize();
    }

    // Start/stop the audio and analyzers
    if (audioElement.paused) {
        f1.start();
        w1.start();
        a1.start();
        a2.start();
        audioElement.play();
    } else {
        f1.stop();
        w1.stop();
        a1.stop();
        a2.stop();
        audioElement.pause();
    }
    
}
```