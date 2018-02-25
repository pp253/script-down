import * as PIXI from 'pixi.js'
import * as _ from 'lodash'
import Scene from './scene'
import Subtitle from './subtitle'
import ViewManager from './view-manager'
import Parser from './parser/index'
import {ScriptDownDefaultOptions} from './constant'
import {Script} from './parser/constant'

export default class ScriptDown extends PIXI.Application {
  private options: PIXI.ApplicationOptions
  private script: Script
  public Scene: Scene
  public Subtitle: Subtitle
  public ViewManager: ViewManager

  constructor (script: Script, options: PIXI.ApplicationOptions) {
    super(_.defaultsDeep(options || {}, ScriptDownDefaultOptions))

    this.options = _.defaultsDeep(options || {}, ScriptDownDefaultOptions)

    this.script = script

    // Scene
    this.Scene = new Scene(this, {
      height: this.renderer.height,
      width: this.renderer.width
    })
    this.stage.addChild(this.Scene)

    // Subtitle
    new PIXI.Text()
    this.Subtitle = new Subtitle(this, {
      height: 180,
      width: this.renderer.width
    }, )
    this.stage.addChild(this.Subtitle)
    this.Subtitle.x = 0
    this.Subtitle.y = this.renderer.height - 180

    // ViewManager
    this.ViewManager = new ViewManager(this, script)

    this.Subtitle.on('pointerdown', (event: PIXI.interaction.InteractionEvent) => {
      this.ViewManager.next(event)
    })
  }
}

declare global {
  interface Window {
    ScriptDown: typeof ScriptDown
    Parser: typeof Parser
  }
}

window.ScriptDown = ScriptDown
window.Parser = Parser
