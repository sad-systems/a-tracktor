---
title: 'Example-7: Media player list'
group: MediaPlayer
category: Examples
---

# Media player list.

{@link media-player.MediaPlayerList | See class description here}.

## 1. Define HTML

```HTML
<body>
  <div class="media-player-list"></div>
</body>
```

## 2. Set the list of media files.

```javascript
import { MediaPlayerList, FrequencyAnalyzer } from '@sad-systems/a-tracktor';

const mediaList = [
  {
    // First media with default params.
    source: 'audio1.mp3',
    poster: 'image1.jpg',
  },
  {
    // Second media with additional params.
    source: 'audio2.mp3',
    poster: 'image2.jpg',
    volume: 0.5, // 50% of volume
    position: 5, // offset in seconds
    playerOptions: {
      analyzerClass: FrequencyAnalyzer,
      analyzerOptions: { color: '#f00' },
      mediaTimePointerOptions: { pointerStyle: { top: '', bottom: '', background: '#f00' } },
    },
  },
  // ...
];
```

### Set a list of optional params if needed.

```javascript
const mediaListOption = { loop: true };
```

## 3. Create media player list

### Case 1:

#### Add media player list to the web page manually.

```javascript
const mediaPlayerList = new MediaPlayerList(mediaList, mediaListOption);

const el = document.querySelector('.media-player-list');
el.append(mediaPlayerList.getViewElement());
```

### Case 2:

#### Add media player list to the web page automatically.

```javascript
const mediaPlayerList = new MediaPlayerList(mediaList, { viewElement: '.media-player-list' });
```
