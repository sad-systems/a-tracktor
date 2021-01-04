### Example 1

Using existed audio and view element on the page.

HTML:
```HTML
<body>
    <audio id="audio" src="some-audio-file.mp3"></audio>
    <div id="div-analyzer"></div>
    <button id="btn-play">Play/Pause</button>
</body>

```

Javascript:
```javascript
import { FrequencyAnalyzer } from '@sad-systems/a-tracktor';

const audioElement = document.getElementById('audio');
const viewElement = document.getElementById('div-analyzer');
const playBtnElement = document.getElementById('btn-play');

const f = new FrequencyAnalyzer(audioElement, viewElement, { color: '#ffb21d' });

playBtnElement.onclick = () => {
  if (audioElement.paused) {
    f.start();
    audioElement.play();
  } else {
    f.stop();
    audioElement.pause();
  }
}
```