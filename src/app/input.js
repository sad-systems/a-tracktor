import { stop, waveFormGraph } from './test0';

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
