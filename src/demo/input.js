import { stop, waveFormGraph } from './unit-1';

/**
 * Input of audio files.
 */

const audioElement = document.getElementById('audio');
const inputElement = document.getElementById('input');

inputElement.onchange = (event) => {
    const files = event.target.files;
    if (files.length < 1) { return ; }

    const file = files[0];
    const fileReader = new FileReader();

    stop();
    fileReader.readAsDataURL(file);
    fileReader.onloadend = () => {
        audioElement.src = fileReader.result;
        waveFormGraph.render();
    };
}
