---
title: 'Example-5: Analyze a microphone'
group: Analyzers
category: Examples
---

# Analyze a microphone.

HTML:

```HTML
<body>
    <div id="mic-analyzer"></div>
    <button id="btn-mic">Activate a microphone</button>
</body>

```

Javascript:

```javascript
import { FrequencyAnalyzer } from '@sad-systems/a-tracktor';

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

const viewElement = document.getElementById('mic-analyzer');
const buttonMic = document.getElementById('btn-mic');

let audioContext;
let micStream;
const f1 = new FrequencyAnalyzer(null, viewElement);

buttonMic.onclick = () => !micStream && startMicSession();

/**
 * Starts analyze the microphone
 */
const startMicSession = () => {
  navigator.getUserMedia(
    { audio: true, video: false },
    (stream) => {
      micStream = stream;

      audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
      const mediaSource = audioContext.createMediaStreamSource(stream);

      f1.changeAudioSource(mediaSource);
      f1.start();
    },
    (error) => {
      console.log('Error:', error.message);
    },
  );
};
```
