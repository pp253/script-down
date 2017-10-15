import * as PIXI from 'pixi.js'
import MultiStyleText from 'pixi-multistyle-text'
import _ from 'lodash'
import { ColorChangeableGraphic } from '../../utils'

export default class Subtitle extends PIXI.Container {
  constructor (options, gamebase) {
    super()
    this.gamebase = gamebase
    this.app = this.gamebase.app

    this.options = _.merge({
      height: 180,
      width: 800,
      backgroundColor: 0x009688,
      paddingTop: 30,
      paddingRight: 30,
      paddingBottom: 30,
      paddingLeft: 30,
      content: {
        'default': {
          fontFamily: 'Arial',
          fontSize: '20px',
          fontWeight: 100,
          fill: '#cccccc',
          align: 'left',
          wordWrap: true,
          wordWrapWidth: 740
        },
        'b': {
          fontWeight: 'bold'
        },
        'i': {
          fontStyle: 'italic'
        }
      }
    }, options)

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

  push (msg) {
    if (this.content) {
      this.content.text = msg
    }
  }

  /**
   * @param {String} name
   * @param {any} value
   */
  set (name, value) {
    this[name] = value
  }
}
