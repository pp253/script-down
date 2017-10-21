import * as PIXI from 'pixi.js'
import Stage from './stage'
import Subtitle from './subtitle'
import ViewManager from './view-manager'
import parser from './parser'


interface Options {
  [propName: string]: any
}

interface Script {
  [index: number]: any
  readonly $type: string
  readonly author?: string
  readonly version?: string
}


export default class ScriptDown extends PIXI.Application {
  private script: Script

  public stage: 

  constructor (script: Script, options: Options) {
    super()

    this.script = script

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
