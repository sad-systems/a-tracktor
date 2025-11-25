/**
 * @mergeModuleWith utils
 * @packageDocumentation
 */
import { bounds } from './bounds';

/**
 * Interface for Slider event handler.
 */
interface ISliderEventHandler {
  // constructor(element: HTMLElement, callbackUpdateValue: (value: number) => any): void;
  /**
   * Changes position on mouse move.
   *
   * @param event Mouse event.
   */
  onMousemove(event: MouseEvent): void;
  /**
   * Changes position on double click.
   *
   * @param event Mouse event.
   */
  onDblclick(event: MouseEvent): void;
  /**
   * Changes position on touch move (for mobile devices).
   *
   * @param event Touch event.
   */
  onTouchmove(event: TouchEvent): void;
}

/**
 * Slider event handler for X direction.
 * Slider of X-axe.
 */
class SliderEventHandlerX implements ISliderEventHandler {
  constructor(
    private element: HTMLElement,
    private callbackUpdateValue: (value: number) => any,
  ) {}

  onMousemove(event: MouseEvent) {
    if (event.buttons === 1) {
      const x = event.pageX;
      const pos = (x - this.element.getBoundingClientRect().left) / this.element.clientWidth;

      this.callbackUpdateValue(bounds(pos));
    }
  }

  onDblclick(event: MouseEvent) {
    const x = event.pageX;
    const pos = (x - this.element.getBoundingClientRect().left) / this.element.clientWidth;

    this.callbackUpdateValue(bounds(pos));
  }

  onTouchmove(event: TouchEvent): void {
    const x = event.touches ? event.touches[0]?.pageX : (event as any).pageX;
    const pos = (x - this.element.getBoundingClientRect().left) / this.element.clientWidth;

    this.callbackUpdateValue(bounds(pos));
  }
}

/**
 * Slider event handler for Y direction.
 * Slider of Y-axe.
 */
class SliderEventHandlerY implements ISliderEventHandler {
  constructor(
    private element: HTMLElement,
    private callbackUpdateValue: (value: number) => any,
  ) {}

  onMousemove(event: MouseEvent) {
    if (event.buttons === 1) {
      const y = event.pageY;
      const pos = 1 - (y - this.element.getBoundingClientRect().top) / this.element.clientHeight;

      this.callbackUpdateValue(bounds(pos));
    }
  }

  onDblclick(event: MouseEvent) {
    const y = event.pageY;
    const pos = 1 - (y - this.element.getBoundingClientRect().top) / this.element.clientHeight;

    this.callbackUpdateValue(bounds(pos));
  }

  onTouchmove(event: TouchEvent): void {
    const y = event.touches ? event.touches[0]?.pageY : (event as any).pageY;
    const pos = 1 - (y - this.element.getBoundingClientRect().top) / this.element.clientHeight;

    this.callbackUpdateValue(bounds(pos));
  }
}

/**
 * Types of slider.
 */
export enum SliderType {
  X = 'x',
  Y = 'y',
}

/**
 * Slider class.
 *
 * Transforms the element into a slider that responds to mouse (with the left mouse button held down)
 * or finger movement, returning a percentage value between 0 and 1 depending on its position within the element.
 * It can control movement along the X or Y axis.
 *
 * Example:
 *
 * ```javascript
 * const viewElement = document.getElementById('slider');
 * const slider = new Slider(viewElement, (position) => console.log(position), { type: SliderType.X });
 * ```
 *
 * Use the `destroy` method when the slider is no longer needed.
 *
 * ```javascript
 * slider.destroy();
 * ```
 */
export class Slider {
  private readonly eventHandler: ISliderEventHandler;
  private readonly onMousemove: Function;
  private readonly onDblclick: Function;
  private readonly onTouchmove: Function;

  constructor(
    private element: HTMLElement,
    private callbackUpdateValue: (value: number) => any,
    private options?: { type?: SliderType },
  ) {
    this.eventHandler =
      options?.type === SliderType.Y
        ? new SliderEventHandlerY(element, callbackUpdateValue)
        : new SliderEventHandlerX(element, callbackUpdateValue);

    this.onMousemove = (event: MouseEvent) => this.eventHandler.onMousemove(event);
    this.onDblclick = (event: MouseEvent) => this.eventHandler.onDblclick(event);
    this.onTouchmove = (event: TouchEvent) => this.eventHandler.onTouchmove(event);

    element.addEventListener('mousemove', this.onMousemove as EventListener);
    element.addEventListener('dblclick', this.onDblclick as EventListener);
    element.addEventListener('touchmove', this.onTouchmove as EventListener);
  }

  destroy() {
    this.element.removeEventListener('mousemove', this.onMousemove as EventListener);
    this.element.removeEventListener('dblclick', this.onDblclick as EventListener);
    this.element.removeEventListener('touchmove', this.onTouchmove as EventListener);
  }
}
