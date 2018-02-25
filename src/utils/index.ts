import * as PIXI from 'pixi.js'
import { ColorReplaceFilter } from 'pixi-filters'

// 不得已
interface ColorReplaceFilterInterface extends PIXI.Filter<any> {
  newColor: number
}

/**
 * Use ColorChangeableGraphic as a normal PIXI.Graphics with
 * a powerful feature that you can change its fillColor by
 *  `colorChangeableGraphic.backgroundColor = 0x00ff00`
 */
export class ColorChangeableGraphic extends PIXI.Graphics {
  set backgroundColor (val: number) {
    (<ColorReplaceFilterInterface>(this.filters[0])).newColor = val
  }
  get backgroundColor (): number {
    return (<ColorReplaceFilterInterface>(this.filters[0])).newColor
  }

  constructor () {
    super()

    /**
     * You can use `this.background.filters[0].newColor = 0x0` to change the background color
     * See more: https://pixijs.github.io/pixi-filters/docs/PIXI.filters.ColorReplaceFilter.html
     */
    this.filters = [new ColorReplaceFilter(0x0, 0x00ff00)]
  }
}
