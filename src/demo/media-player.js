import '../styles/media-player.scss';
import { AmplitudeAnalyzer, FrequencyAnalyzer, MediaPlayerList } from '../lib';

/**
 * Media player demo.
 */

const mediaList = [
  {
    source: 'assets/sounds/test-melody.mp3',
    poster: 'https://sadspace.ru/1272b306359e33665f26.jpg',
    volume: 1,
    position: 0,
    playerOptions: {
      analyzerClass: FrequencyAnalyzer,
      analyzerOptions: { color: '#0f0' },
      mediaTimePointerOptions: { pointerStyle: { top: '', bottom: '', background: '#00ff0082' } },
    },
  },
  {
    source: 'assets/sounds/test-stereo.mp3', // 'assets/sounds/test-melody.mp3', // ,
    poster: 'https://ocarius.sadspace.ru/media/audio/2015/2015-1.ru.jpg',
    volume: 0.5,
    position: 5,
    playerOptions: {
      //analyzerClass: FrequencyAnalyzer, //AmplitudeAnalyzer,
      analyzerOptions: { color: '#f00' },
      mediaTimePointerOptions: { pointerStyle: { top: '', bottom: '', background: '#f00' } },
    },
  },
  {
    source: 'assets/sounds/test-sound-40-20000.mp3', // 'assets/sounds/test-melody.mp3', //,
    poster: 'https://ocarius.sadspace.ru/media/audio/2002/2002-1-1.jpg',
    volume: 1,
    position: 0,
    playerOptions: {
      analyzerClass: FrequencyAnalyzer, //AmplitudeAnalyzer,
      analyzerOptions: { color: '#fbd298' },
      mediaTimePointerOptions: { pointerStyle: { top: '', bottom: '', background: '#fbd298' } },
    },
  },
];
const mediaListOption = { loop: true, single: false };

// Media player list.

const mediaPlayerList = new MediaPlayerList(mediaList, mediaListOption);
//const mediaPlayerList = new MediaPlayerList(mediaList, { viewElement: '.media-player-list' });

const el = document.querySelector('.media-player-list');
el.append(mediaPlayerList.getViewElement());

// Media player.

/*
const MEDIA_SOURCE = 'https://ocarius.sadspace.ru/media/audio/2025/hol-chapter-9.mp3';
const MEDIA_POSTER = 'https://sadspace.ru/1272b306359e33665f26.jpg';
const MEDIA_SOURCE2 = 'https://ocarius.sadspace.ru/media/audio/2025/hol-chapter-9.mp3';
const MEDIA_POSTER2 = 'https://sadspace.ru/1272b306359e33665f26.jpg';
const MEDIA_SOURCE3 = 'Ballada-2.mp3'; //'https://ocarius.sadspace.ru/media/audio/2015/NG-Remix-4-minus.mp3';
const MEDIA_POSTER3 = 'https://ocarius.sadspace.ru/media/audio/2015/2015-1.ru.jpg';

/* --- Case 1. With existed view element. *
// const viewElement = document.querySelector<HTMLDivElement>('.test-player')!;
const mediaPlayer1 = new MediaPlayer(MEDIA_SOURCE, {
  poster: MEDIA_POSTER,
  viewElement: '.test-player',
  analyzerOptions: { color: '#f00' },
});

setTimeout(() => {
  console.log('change source');
  mediaPlayer1.setMediaSource(MEDIA_SOURCE3);
  mediaPlayer1.setPoster(MEDIA_POSTER3);
}, 5000);

// --- Case 2. With auto created view element.
const el = document.querySelector<HTMLDivElement>('.media-player-app')!;
const mediaPlayer2 = new MediaPlayer(MEDIA_SOURCE2, {
  poster: MEDIA_POSTER2,
  analyzerClass: FrequencyAnalyzer,
  analyzerOptions: { color: '#0f0' },
  mediaTimePointerOptions: { pointerStyle: { top: '', bottom: '', background: '#00ff0082' } },
});

el.append(mediaPlayer2.getViewElement());
/**/

//---- Debug set media params.
//const media = mediaPlayer2.getMediaElement();
//media.currentTime = 600;
//media.volume = 0.5;
//----

/*
  view.addEventListener('click', (event) => {
    if (event.target !== poster) return;
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  });
*/
