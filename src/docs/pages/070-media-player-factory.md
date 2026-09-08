---
title: 'Example-7: Media player factory'
group: MediaPlayer
category: Examples
---

# Media player factory.

{@link media-player.MediaPlayerFactory | See class description here}.

## Case 1. Auto create view elements and manually add them to web page.

### 1. Define HTML container.

```HTML
<body>
  <div class="media-player-list"></div>
</body>
```

### 2. Import classes and styles.

```javascript
import '@sad-systems/a-tracktor/css/media-player.css'; // Use defaults media player and list CSS styles.
// Also you can use SCSS styles from:
// '@sad-systems/a-tracktor/styles/media-player.scss'.
import { MediaPlayerFactory, FrequencyAnalyzer } from '@sad-systems/a-tracktor';
```

### 3. Set the list of media files and player options.

```javascript
const mediaList = [
  {
    // First media with default params.
    source: 'audio1.mp3',
    playerOptions: {
      poster: 'image1.jpg',
    },
  },
  {
    // Second media with additional params.
    source: 'video.mp4',
    playerOptions: {
      poster: 'image2.jpg',
      volume: 0.5, // 50% of volume
      position: 5, // offset in seconds
      analyzerClass: FrequencyAnalyzer,
      analyzerOptions: { color: '#f00' },
      mediaTimePointerOptions: { pointerStyle: { top: '', bottom: '', background: '#f00' } },
    },
  },
  // ...
];
```

### 4. Create media player factory (with options if needed).

```javascript
const mediaPlayerFactory = new MediaPlayerFactory({ loop: true, single: false, volume: 0.75 });
```

### 5. Create media players and add them to the web page.

```javascript
const elContainer = document.querySelector('.media-player-list');

for (let item of mediaList) {
  const newPlayer = mediaPlayerFactory.createMediaPlayer(item.source, item.playerOptions);

  elContainer.append(newPlayer.getViewElement());
}
```

## Case 2. Auto create media players and add them to existed view elements.

### 1. Define HTML elements for media players.

```HTML
<body>
  <div style="width: 400px">
    <div class="media-player-1"></div>
    <hr>
    <div class="media-player-2"></div>
  </div>
</body>
```

### 2. ([the same as in Case 1.2](#2-import-classes-and-styles))

### 3. ([the same as in Case 1.3](#3-set-the-list-of-media-files-and-player-options))

### 4. ([the same as in Case 1.4](#4-create-media-player-factory-with-options-if-needed))

### 5. Create media players and add them to the web page.

```javascript
for (let item of mediaList) mediaPlayerFactory.createMediaPlayer(item.source, item.playerOptions);
```
