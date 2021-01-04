### Example 2

Auto creation the audio and view elements.

HTML:
```HTML
<body>
    <button id="btn-play">Play/Pause</button>
</body>

```

Javascript:
```javascript
import { WaveformAnalyzer } from '@sad-systems/a-tracktor';

const playBtnElement = document.getElementById('btn-play');

const w = new WaveformAnalyzer();
const audioElement = w.getAudioSource().audioElement;
const viewElement = w.getViewElement();

// Customize background
viewElement.style.backgroundColor = '#800';

// Set audio file
audioElement.src = 'some-audio-file.mp3';

playBtnElement.onclick = () => {
  if (audioElement.paused) {
    w.start();
    audioElement.play();
  } else {
    w.stop();
    audioElement.pause();
  }
}
```