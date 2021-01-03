# Audio-tracktor

The library of widgets for visualizing audio data.

> Сменить язык: [![Русский](docs/assets/images/ru.gif)](README.ru.md) [![English](docs/assets/images/en.gif)](README.md)

## Used technologies

  * [Web Audio API](https://developer.mozilla.org/en/docs/Web/API/Web_Audio_API)
  * [Typescript](http://www.typescriptlang.org/)
    
## Description

The library contains a set of widgets to visualize audio data on the web page.

## Usage

Install:
```
yarn add @sad-systems/a-tracktor
```

Inject to the project:

```javascript
import Widgets from '@sad-systems/a-tracktor';

const audioElement = document.getElementById('audio');
const viewElement1 = document.getElementById('div-analyzer');
const playBtnElement = document.getElementById('btn-play');

const f = new Widgets.FrequencyAnalyzer(audioElement, viewElement1, { color: '#ffb21d' });

playBtnElement.onclick = () => { 
    if (audioElement.paused) {
        f.start();
        audioElement.play();
    } else {
        f.stop();
        audioElement.pause();
    }
}
````   
    
## Live demo

Try the [live demo](http://examples.sad-systems.ru/a-tracktor)
  

## Documentation

View [description](http://examples.sad-systems.ru/a-tracktor/docs/).

## Development

### Source files

  All the source files are placed under the [/src](./src) folder
  
### Build files

 Production files are placed under the `/dist` folder.

### Setup

```
yarn
```

### Compiles and hot-reloads for development
```
yarn start
```

### Compiles and minifies for production
```
yarn build
```

### Build the demo project
```
yarn build-demo
```

## License

ISC

## Credits

  * __author__: Mr Digger
  * __copyright__:  © [SAD-Systems](http://sad-systems.ru), 2021