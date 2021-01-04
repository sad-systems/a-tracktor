### Example 3

Using multiple analyzers for the same audio source.

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

const audioElement = document.getElementById('audio');
const playBtnElement = document.getElementById('btn-play');

const f = new FrequencyAnalyzer(audioElement);
const w = new WaveformAnalyzer(audioElement);
const a = new AmplitudeAnalyzer(audioElement);

playBtnElement.onclick = () => {
  if (audioElement.paused) {
      f.start();
      w.start();
      a.start();
      audioElement.play();
  } else {
      f.stop();
      w.stop();
      a.stop();
      audioElement.pause();
  }
}
```