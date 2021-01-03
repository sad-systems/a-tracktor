# Audio-tracktor

Библиотека виджетов для визуализации аудио данных.

> Change language: [![Русский](docs/assets/images/ru.gif)](README.ru.md) [![English](docs/assets/images/en.gif)](README.md)

## Используемые технологии

  * [Web Audio API](https://developer.mozilla.org/ru/docs/Web/API/Web_Audio_API)
  * [Typescript](http://www.typescriptlang.org/)
        
## Описание

Библиотека содержит набор виджетов для визуализации аудио данных на веб странице.

## Как использовать

Установка:
```
yarn add @sad-systems/a-tracktor
```

Подключение к проекту:

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

## Живая демонстрация
    
Посмотрите как это работает на [живом примере](http://examples.sad-systems.ru/a-tracktor)
   
## Документация

Посмотреть [oписание](http://examples.sad-systems.ru/a-tracktor/docs/).

## Разработка
 
### Исходные файлы проекта

  Все файлы расположены в каталоге [/src](./src)
  
### Файлы сборки

 Файлы сборки помещаются в папку `/dist`.

### Установка

```
yarn
```

### Компиляция и горячая перезагрузка для разработки
```
yarn start
```

### Компиляция и минификация для рабочей версии
```
yarn build
```

### Сборка демо проекта
```
yarn build-demo
```


## Лицензия

ISC

## Автор

  * __author__: Mr Digger
  * __copyright__:  © [SAD-Systems](http://sad-systems.ru), 2021