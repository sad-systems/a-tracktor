import '../styles/media-player.scss';
import { AmplitudeAnalyzer, FrequencyAnalyzer, MediaPlayer, MediaPlayerList } from '../lib';
import { MediaPlayerFactory } from '../widgets/media-player/media-player-factory';
import projectInfo from '../../package.json';

/**
 * Media player demo.
 */

export const APPLICATION_VERSION = projectInfo.version;
export const APP_BUILD_HASH = '?' + APPLICATION_VERSION;

const textVersion = document.querySelector('.project-version');

if (textVersion) textVersion.textContent = 'v' + APPLICATION_VERSION;

const mediaList = [
  {
    source: 'assets/sounds/test-melody.mp3',
    playerOptions: {
      poster: 'https://sadspace.ru/1272b306359e33665f26.jpg',
      volume: 1,
      position: 0,
      analyzerClass: FrequencyAnalyzer,
      analyzerOptions: { color: '#0f0' },
      mediaTimePointerOptions: { pointerStyle: { top: '', bottom: '', background: '#00ff0082' } },
    },
  },
  {
    source: 'assets/sounds/test-stereo.mp3', // 'assets/sounds/test-melody.mp3', // ,
    playerOptions: {
      poster: 'https://ocarius.sadspace.ru/media/audio/2015/2015-1.ru.jpg',
      volume: 0.5,
      position: 5,
      //analyzerClass: FrequencyAnalyzer, //AmplitudeAnalyzer,
      analyzerOptions: { color: '#f00' },
      mediaTimePointerOptions: { pointerStyle: { top: '', bottom: '', background: '#f00' } },
    },
  },
  {
    source: 'assets/sounds/test-sound-40-20000.mp3', // 'assets/sounds/test-melody.mp3', //,
    playerOptions: {
      poster: 'https://ocarius.sadspace.ru/media/audio/2002/2002-1-1.jpg',
      posterHint: 'Play audio',
      events: {
        clickPoster: (mp) => {
          console.log('Audio is clicked:');
          mp.toggle();
        },
      },
      analyzerClass: FrequencyAnalyzer, //AmplitudeAnalyzer,
      analyzerOptions: { color: '#fbd298' },
      mediaTimePointerOptions: { pointerStyle: { top: '', bottom: '', background: '#fbd298' } },
      enableButtonFullscreen: true,
    },
  },
  {
    source: 'https://ocarius.sadspace.ru/media/video/dragon4x3.mp4' + APP_BUILD_HASH,
    playerOptions: {
      poster: 'https://ocarius.sadspace.ru/media/video/dragon16x9.jpg',
      posterHint: 'Nothing but just click',
      events: {
        clickPoster: (mp) => {
          console.log('Video is clicked:');
          // mp.toggle();
        },
      },
      analyzerClass: FrequencyAnalyzer, // AmplitudeAnalyzer,
      analyzerOptions: { color: '#d46b25' },
      autoHideAnalyzer: 2,
      mediaTimePointerOptions: { pointerStyle: { top: '', bottom: '', background: '#d46b25' } },
    },
  },
  {
    source: 'https://ocarius.sadspace.ru/media/video/dragon4x3.mp4' + APP_BUILD_HASH,
    playerOptions: {
      viewElementClass: 'media-player-item extended',
      poster: 'https://ocarius.sadspace.ru/media/video/dragon4x3.jpg',
      posterHint: 'Play/Pause video',
      events: {
        clickPoster: (mp) => {
          mp.toggle();
          console.log('Poster click');
        },
        enterFullscreen: () => {
          console.log('Enter to Full-screen mode');
        },
        exitFullscreen: () => {
          console.log('Exit from Full-screen mode');
        },
        play: (mp) => {
          console.log('Play');
        },
        pause: (mp) => {
          console.log('Pause');
        },
        ended: (mp) => {
          console.log('Ended');
        },
        changeVolume: (value) => {
          console.log('Volume set to:', value);
        },
        changePosition: (value) => {
          console.log('Position set to:', value);
        },
      },
      posterElementClass: 'frame-aspect-ratio-4x3',
      analyzerClass: FrequencyAnalyzer, // AmplitudeAnalyzer,
      analyzerOptions: { color: '#d46b25' },
      autoHideAnalyzer: 0,
      mediaTimePointerOptions: { pointerStyle: { top: '', bottom: '', background: '#d46b25' } },
    },
  },
];
const mediaListOption = { loop: true, single: false, volume: 0.75 };

// Use Media player factory.

const mediaPlayerFactory = new MediaPlayerFactory(mediaListOption);
const elContainer = document.querySelector('.media-player-list');

const players = [];

for (let item of mediaList) {
  const newPlayer = mediaPlayerFactory.createMediaPlayer(item.source, item.playerOptions);

  players.push(newPlayer);

  elContainer.append(newPlayer.getViewElement());
}

/*
// Test player removing.
setTimeout(() => {
  console.log('remove player 2');
  mediaPlayerFactory.destroyMediaPlayer(players[1]);
}, 5000);

// Media player list. (deprecated)
/*
const mediaPlayerList = new MediaPlayerList(mediaList, mediaListOption);
//const mediaPlayerList = new MediaPlayerList(mediaList, { viewElement: '.media-player-list' });

const el = document.querySelector('.media-player-list');
el.append(mediaPlayerList.getViewElement());
*/

// Video player.
/**
const MEDIA_SOURCE = 'https://ocarius.sadspace.ru/media/video/martian-voyage.mp4';
const MEDIA_POSTER = 'https://ocarius.sadspace.ru/media/video/martian-voyage.jpg';

const mediaPlayer1 = new MediaPlayer(MEDIA_SOURCE, {
  poster: MEDIA_POSTER,
  viewElement: '.video-player-list',
  analyzerClass: null,
  analyzerOptions: { color: '#f00' },
});
/**/
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
