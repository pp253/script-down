import * as PIXI from 'pixi.js'
import * as _ from 'lodash'
import {ColorChangeableGraphic} from './utils'
import {SceneOptions, SceneDefaultOptions, Character} from './constant'

export default class ImplementedScene extends PIXI.Container {
  private app: PIXI.Application
  private options: SceneOptions
  public background: ColorChangeableGraphic
  public characters: Map<string, Character>

  constructor (app: PIXI.Application, options: SceneOptions) {
    super()

    this.app = app

    this.options = _.defaultsDeep(options, SceneDefaultOptions)

    // shortcut
    this.characters = this.options.characters

    // Make container being interactive
    this.interactive = true

    // Draw the background rectangle
    this.background = new ColorChangeableGraphic()
    this.addChild(this.background)
    this.background.beginFill(0x0)
    this.background.drawRect(0, 0, this.options.width, this.options.height)
    this.background.endFill()
    this.background.backgroundColor = this.options.backgroundColor
  }

  /**
   * @param {String} name should be unique to others
   * @param {Character} character
   */
  addCharacter (name: string, character: Character): Character {
    this.addChild(character)
    if (this.options.characters[name]) {
      console.log('The name of character', name, 'has already exist.')
    }
    this.options.characters[name] = character
    return character
  }

  /**
   * @param {String} name
   * @param {any} value
   */
  set (name: string, value: any): Scene {
    this[name] = value
    return this
  }
}
