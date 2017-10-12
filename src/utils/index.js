import * as PIXI from 'pixi.js'
import { ColorReplaceFilter } from 'pixi-filters'

/**
 * Use ColorChangeableGraphic as a normal PIXI.Graphics with
 * a powerful feature that you can change its fillColor by
 *  `colorChangeableGraphic.backgroundColor = 0x00ff00`
 */
export class ColorChangeableGraphic extends PIXI.Graphics {
  constructor () {
    super()

    /**
     * You can use `this.background.filters[0].newColor = 0x0` to change the background color
     * See more: https://pixijs.github.io/pixi-filters/docs/PIXI.filters.ColorReplaceFilter.html
     */
    this.filters = [new ColorReplaceFilter(0x0, 0x00ff00)]

    Object.defineProperty(this, 'backgroundColor', {
      set: function (val) { this.filters[0].newColor = val },
      get: function (val) { return this.filters[0].newColor }
    })
  }

  destroy () {
    this.filters = null
    super.destroy()
  }
}
