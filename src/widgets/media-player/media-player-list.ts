/**
 * @mergeModuleWith media-player
 * @packageDocumentation
 */
import { IMediaPlayerOptions, MediaPlayer } from './media-player';

/**
 * Options for the MediaListItem.
 */
export interface IMediaListItem {
  /** URL of media source. */
  source?: string;
  /** URL of poster image for the media source. */
  poster?: string;
  /** Initial media source volume. Value should be in range of [0 - 1] (it means: 0 - 100%). */
  volume?: number;
  /** Initial time position offset in seconds. */
  position?: number;
  /**
   * Any player options if needed.
   * @see {@link media-player.IMediaPlayerOptions} for details.
   */
  playerOptions?: IMediaPlayerOptions;
}
/**
 * Options for the MediaPlayerList.
 */
export interface IMediaPlayerListOptions {
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
  /** CSS selector or HTML element to render player content. */
  viewElement?: string | HTMLElement;
  /** CSS selector or HTML element for container class. */
  viewContainerClass?: string;
  /** Tag of list container HTML element. By default `ul`. */
  viewContainerTag?: string;
  /** Tag of list item HTML element. By default `li`. */
  viewItemTag?: string;
}

/**
 * The widget represents a list of media players.
 *
 * ![](../../docs/assets/images/media-player-list.png)
 *
 * @example
 * ```javascript
 * const mediaPlayerList = new MediaPlayerList([{ source: 'audio1.mp3', poster: 'image.jpg' }], { viewElement: '.media-player-list' });
 * ```
 *
 * @see [Complete example for MediaPlayerList](../../docs/pages/070-media-player-list.md)
 */
export class MediaPlayerList {
  // User options.
  protected viewElement: HTMLElement;
  protected viewContainerClass: string = '';
  protected viewContainerTag: string = 'ul';
  protected viewItemTag: string = '';
  protected volume = 1;
  protected loop = false;
  protected single = false;

  // Instance params.
  protected isViewElementDefined = false;
  protected mediaPlayerList: {
    player: MediaPlayer;
    onPlay: () => void;
    onEnded: () => void;
  }[] = [];

  /**
   * Constructor.
   *
   * @param mediaList
   * @param options
   */
  constructor(mediaList: IMediaListItem[] = [], options?: IMediaPlayerListOptions) {
    this.setOptions(options);
    this.init(mediaList);
  }

  /**
   * Destroys all elements and removes all their own event listeners.
   */
  destroy() {
    this.destroyView();
  }

  /**
   * Redraws all elements of the list.
   */
  resize() {
    this.mediaPlayerList.forEach((item) => item.player.resize());
  }

  /**
   * Returns the HTML element to render the widget.
   */
  getViewElement(): HTMLElement {
    return this.viewElement;
  }

  protected setOptions(options?: IMediaPlayerListOptions) {
    if (options?.viewElement) {
      if (options.viewElement instanceof HTMLElement) {
        this.viewElement = options.viewElement;
      } else if (typeof options.viewElement === 'string') {
        this.viewElement = document.querySelector<HTMLDivElement>(options.viewElement)!;
      }
      if (!this.viewElement) {
        throw Error('[MPL] options.viewElement is incorrect!');
      }
    }

    this.isViewElementDefined = !!this.viewElement;
    this.viewContainerClass = options?.viewContainerClass ?? this.viewContainerClass;
    this.viewContainerTag = String(
      options?.viewContainerTag ?? this.viewContainerTag,
    ).toLowerCase();
    this.viewItemTag =
      options?.viewItemTag || (['ul', 'ol'].includes(this.viewContainerTag) ? 'li' : 'div');
    this.volume = options?.volume ?? this.volume;
    this.loop = options?.loop ?? this.loop;
    this.single = options?.single ?? this.single;
  }

  protected init(mediaList: IMediaListItem[] = []) {
    this.createView(mediaList);
  }

  protected createView(mediaList: IMediaListItem[] = []) {
    this.destroyView();

    if (!this.isViewElementDefined) {
      this.viewElement = document.createElement(this.viewContainerTag);
      // Insensibly add to DOM (to calculate real HTML params). Important!
      this.viewElement.style.visibility = 'hidden';
      document.body.append(this.viewElement);
    }

    this.viewContainerClass && this.viewElement.classList.add(this.viewContainerClass);

    // Create player  list.
    mediaList.forEach((item, index) => {
      const playerOptions = { viewElementTag: this.viewItemTag, ...(item.playerOptions ?? {}) };
      const player = this.createPlayer({ ...item, playerOptions });

      const onPlay = () => this.playItem(index);
      const onEnded = () => this.playItemNextAfter(index);

      player.getMediaElement().addEventListener('play', onPlay);
      player.getMediaElement().addEventListener('ended', onEnded);

      this.viewElement.append(player.getViewElement());

      this.mediaPlayerList.push({ player, onPlay, onEnded });
    });

    if (!this.isViewElementDefined) {
      // Remove from DOM.
      this.viewElement.remove();
      this.viewElement.style.visibility = '';
    }

    this.isViewElementDefined = true;
  }

  /**
   * Destroys the old list.
   */
  protected destroyView() {
    this.mediaPlayerList.forEach((item) => {
      const player = item.player;

      player.getMediaElement().removeEventListener('play', item.onPlay);
      player.getMediaElement().removeEventListener('ended', item.onEnded);
      player.destroy();
    });
    this.mediaPlayerList = [];
    if (this.viewElement) this.viewElement.innerHTML = '';
  }

  protected createPlayer(item: IMediaListItem): MediaPlayer {
    const player = new MediaPlayer(item.source, item.playerOptions);
    const media = player.getMediaElement();

    item.poster && player.setPoster(item.poster);
    media.currentTime = item.position || 0;

    if (!(item.volume >= 0 && item.volume <= 1)) item.volume = undefined;

    media.volume = item.volume ?? this.volume;

    return player;
  }

  protected playItem(index: number) {
    this.mediaPlayerList.forEach((item, i) => {
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
}
