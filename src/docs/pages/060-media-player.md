---
title: 'Example-6: Media player'
group: MediaPlayer
category: Examples
---

# Media player.

{@link media-player.MediaPlayer | See class description here}.

## 1. Define HTML container.

```HTML
<body>
  <div class="media-player"></div>
</body>
```
## 2. Import classes and styles.
```javascript
import '@sad-systems/a-tracktor/css/media-player.css'; // Use defaults media player and list CSS styles.
                                                       // Also you can use SCSS styles from: 
                                                       // '@sad-systems/a-tracktor/styles/media-player.scss'. 
import { MediaPlayer, FrequencyAnalyzer } from '@sad-systems/a-tracktor';
```

## 3. Define media.

```javascript
const MEDIA_SOURCE1 = 'audio.mp3';
const MEDIA_POSTER1 = 'image.jpg';
const MEDIA_SOURCE2 = 'audio2.mp3';
const MEDIA_POSTER2 = 'image2.jpg';
```

## 4. Create media player

### Case 1. With existed view element.

```javascript
const mediaPlayer = new MediaPlayer(MEDIA_SOURCE1, {
  poster: MEDIA_POSTER1,
  viewElement: '.media-player', // Find existed DOM element by CSS selector.
  analyzerOptions: { color: '#f00' }, // Set color of audio analyzer.
});

// Just to debug: change the media in 5 seconds.
setTimeout(() => {
  console.log('Change media source');
  mediaPlayer.setMediaSource(MEDIA_SOURCE2);
  mediaPlayer.setPoster(MEDIA_POSTER2);
}, 5000);
```

### Case 2. With auto created view element and manually added to web page.

```javascript
const el = document.body;
const mediaPlayer = new MediaPlayer(MEDIA_SOURCE1, {
  poster: MEDIA_POSTER1,
  // More options:
  analyzerClass: FrequencyAnalyzer,
  analyzerOptions: { color: '#0f0' },
  mediaTimePointerOptions: { pointerStyle: { top: '', bottom: '', background: '#00ff0082' } },
});

el.append(mediaPlayer.getViewElement());
```
