import * as PIXI from 'pixi.js'
import MultiStyleText from 'pixi-multistyle-text'
import * as _ from 'lodash'
import { ColorChangeableGraphic } from './utils'
import {SubtitleOptions, SubtitleDefaultOptions} from './constant'

export default class ImplementedSubtitle extends PIXI.Container {
  private app: PIXI.Application
  private options: SubtitleOptions

  public background: ColorChangeableGraphic
  public content: MultiStyleText

  constructor (app: PIXI.Application, options: SubtitleOptions) {
    super()
    
    this.app = app

    this.options = _.defaultsDeep(options, SubtitleDefaultOptions)

    // Make container being interactive
    this.interactive = true

    // Draw the background rectangle
    this.background = new ColorChangeableGraphic()
    this.addChild(this.background)
    this.background.beginFill(0x0)
    this.background.drawRect(0, 0, this.options.width, this.options.height)
    this.background.endFill()
    this.background.backgroundColor = this.options.backgroundColor

    /**
     * Draw the content
     * Seems that the `fill` should be string, cannot be 0x00ff00
     * See more: https://www.npmjs.com/package/pixi-multistyle-text
     */
    this.content = new MultiStyleText('哈哈哈！你中計了吧！有種點我啊\n<b>這是粗體</b>但這不是\n<i>這是斜體</i>但這不是\nABCabc', this.options.content)
    this.addChild(this.content)
    this.content.x = this.options.paddingLeft
    this.content.y = this.options.paddingTop
  }

  push (msg: string): void {
    if (this.content) {
      this.content.text = msg
    }
  }

  /**
   * @param {String} name
   * @param {any} value
   */
  set (name: string, value: any): Subtitle {
    this[name] = value
    return this
  }
}
