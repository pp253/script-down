import * as PIXI from 'pixi.js'
import _ from 'lodash'
import { ColorChangeableGraphic } from '../../utils'

export default class Stage extends PIXI.Container {
  constructor (options, gamebase) {
    super()
    this.gamebase = gamebase
    this.app = this.gamebase.app

    this.options = _.merge({
      height: 600,
      width: 800,
      backgroundColor: 0x90caf9,
      characters: {}
    }, options)

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
  addCharacter (name, character) {
    this.addChild(character)
    if (this.options.characters[name]) {
      console.log('The name of character', name, 'has already exist.')
    }
    this.options.characters[name] = character
  }

  selectCharacter (name) {
    if (!this.options.characters[name]) {
      console.log('The name of character', name, 'is not exist.')
    } else {
      return this.options.characters[name]
    }
  }

  addProp (name, prop) {

  }

  /**
   * @param {String} name
   * @param {any} value
   */
  set (name, value) {
    this[name] = value
  }
}
