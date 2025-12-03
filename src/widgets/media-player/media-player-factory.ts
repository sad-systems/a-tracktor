/**
 * @mergeModuleWith media-player
 * @packageDocumentation
 */
import { IMediaPlayerOptions, MediaPlayer } from './media-player';

/**
 * Options for the MediaPlayerFactory.
 */
export interface IMediaPlayerFactoryOptions {
  /**
   * - TRUE means that the only current file will be played.
   * - FALSE means that when the current file will be ended the next one will be played.
   *
   * By default `false`.
   */
  single?: boolean;
  /** TRUE means that when the last track in the list ends, the first track will start playing. */
  loop?: boolean;
  /** Initial common volume for whole files in list. Value should be in range of [0 - 1] (it means: 0 - 100%). */
  volume?: number;
}

/**
 * The factory to create media player instances.
 * The main goal is to create a linked list of media players that can play one after another in a loop,
 * but never simultaneously.
 *
 * ![](../../docs/assets/images/media-player-list.png)
 *
 * @example
 * ```javascript
 * const mediaPlayerFactory = new MediaPlayerFactory({ loop: true, single: false, volume: 0.75 });
 *
 * const elContainer = document.querySelector('.media-player-list');
 *
 * const player1 = mediaPlayerFactory.createMediaPlayer('sound1.mp3', { poster: 'poster1.jpg' });
 * const player2 = mediaPlayerFactory.createMediaPlayer('sound2.mp3', { poster: 'poster2.jpg' });
 *
 * elContainer.append(player1.getViewElement());
 * elContainer.append(player2.getViewElement());
 * ```
 *
 * @see [Complete example for MediaPlayerFactory](../../docs/pages/070-media-player-factory.md)
 */
export class MediaPlayerFactory {
  // User options.
  protected volume = 1;
  protected loop = false;
  protected single = false;

  // Instance params.
  protected mediaPlayerList: {
    player: MediaPlayer;
    onPlay: () => void;
    onEnded: () => void;
  }[] = [];

  constructor(options?: IMediaPlayerFactoryOptions) {
    this.setOptions(options);
    this.init();
  }

  /**
   * Creates an instance of a new media player.
   * Automatically adds the instance to the internal list.
   *
   * @param source Media file URL.
   * @param options Optional params.
   *
   * @returns Instance of a new media player.
   */
  createMediaPlayer(source: string, options: IMediaPlayerOptions): MediaPlayer {
    const player = this.createPlayer(source, options);
    const onPlay = () => this.playItem(this.getPlayerIndex(player));
    const onEnded = () => this.playItemNextAfter(this.getPlayerIndex(player));

    player.getMediaElement().addEventListener('play', onPlay);
    player.getMediaElement().addEventListener('ended', onEnded);

    this.mediaPlayerList.push({ player, onPlay, onEnded });

    return player;
  }

  /**
   * Destroys the given instance of media player and removes it from internal list.
   *
   * @param player
   */
  destroyMediaPlayer(player: MediaPlayer) {
    const index = this.getPlayerIndex(player);

    if (index > -1) {
      // Destroy player in list.
      this.destroyPlayer(index);
      this.mediaPlayerList.splice(index, 1);
    } else {
      // Destroy orphaned instance of player.
      player.destroy();
    }
  }

  /**
   * Destroys the whole media players and clear the internal list.
   */
  destroyList() {
    this.mediaPlayerList.forEach((_, index) => this.destroyPlayer(index));
    this.mediaPlayerList = [];
  }

  protected createPlayer(source: string, options: IMediaPlayerOptions): MediaPlayer {
    const player = new MediaPlayer(source, options);
    const media = player.getMediaElement();

    if (!(options.volume >= 0 && options.volume <= 1)) options.volume = undefined;

    media.volume = options.volume ?? this.volume;
    media.currentTime = options.position || 0;

    return player;
  }

  protected destroyPlayer(index: number) {
    const item = this.mediaPlayerList[index];

    if (item?.player) {
      item.player.getMediaElement().removeEventListener('play', item.onPlay);
      item.player.getMediaElement().removeEventListener('ended', item.onEnded);
      item.player.destroy();
      item.player = null;
    }
  }

  protected playItem(index: number) {
    this.mediaPlayerList.forEach((item, i) => {
      if (!item.player) return;

      const media = item.player.getMediaElement();

      if (i === index) {
        // Play this.
        media.paused && media.play();
      } else {
        // Pause others.
        !media.paused && media.pause();
      }
    });
  }

  protected getPlayerIndex(player: MediaPlayer): number {
    return this.mediaPlayerList.findIndex((item) => item.player === player);
  }

  protected playItemNextAfter(index: number) {
    if (this.single) {
      if (this.loop) {
        index--;
      } else {
        // Don't play anymore.
        return;
      }
    }

    const nextIndex = index + 1;

    if (nextIndex < this.mediaPlayerList.length) {
      this.playItem(nextIndex);
    } else {
      if (this.loop) {
        this.playItem(0);
      } else {
        console.info('Play list ended');
      }
    }
  }

  protected setOptions(options?: IMediaPlayerFactoryOptions) {
    this.volume = options?.volume ?? this.volume;
    this.loop = options?.loop ?? this.loop;
    this.single = options?.single ?? this.single;
  }

  protected init() {
    this.destroyList();
  }
}
