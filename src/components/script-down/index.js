import * as PIXI from 'pixi.js'
import Stage from './stage'
import Subtitle from './subtitle'
import ViewManager from './view-manager'
import parser from './parser'

export default class ScriptDown extends PIXI.Container {
  constructor (script, gamebase) {
    super()

    if (typeof script === 'string') {
      this.script = parser.parse(script)
    } else if (typeof script === 'object') {
      this.script = script
    } else {
      throw new Error('ScriptDown: Invalid type of script')
    }

    this.gamebase = gamebase
    this.app = this.gamebase.app

    this.app.stage.addChild(this)

    // Stage
    this.stage = new Stage({
      height: this.app.renderer.height,
      width: this.app.renderer.width
    }, this.gamebase)
    this.addChild(this.stage)

    // Subtitle
    this.subtitle = new Subtitle({
      content: {
        height: 180,
        width: this.app.renderer.width
      }
    }, this.gamebase)
    this.addChild(this.subtitle)
    this.subtitle.x = 0
    this.subtitle.y = this.app.renderer.height - 180

    /**
     * Add this after the declaration of this.stage and this.subtitle
     */
    this.ViewManager = new ViewManager(script, this)

    this.subtitle.on('pointerdown', function (event) {
      this.ViewManager.next(event)
    }.bind(this))
  }
}

// Bad
window.ScriptDown = ScriptDown
window.parser = parser
