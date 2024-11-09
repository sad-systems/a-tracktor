import { stop, waveFormGraph, waveFormGraph2 } from './unit-1';

/**
 * Input of audio files.
 */

const audioElement = document.getElementById('audio');
const inputElement = document.getElementById('input');

inputElement.onchange = (event) => {
  const files = event.target.files;
  if (files.length < 1) {
    return;
  }

  const file = files[0];
  const fileReader = new FileReader();

  stop();
  fileReader.readAsDataURL(file);
  fileReader.onloadend = () => {
    audioElement.src = fileReader.result;

    // Test DataSampling
    waveFormGraph.render().then(() => {
      const data = waveFormGraph.getDataSampling(2000);

      waveFormGraph2.setDataSampling(data).render();

      //console.log('data base64:', btoa(data));
      //console.log('data Float base64:', btoa(new Float32Array(data)));
      //console.log('data string:', data.toString());

      // Test creating audio buffer.
      //const ab = new AudioBuffer({ length: data.length, numberOfChannels: 1, sampleRate: data.length });
      //ab.copyToChannel(new Float32Array(data), 0);
      //waveFormGraph2.setAudioBuffer(ab).render();
    });
  };
};
