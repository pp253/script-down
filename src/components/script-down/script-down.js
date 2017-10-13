/**
 * TODO
 * [ ] Add Space Listener
 */

import * as PIXI from 'pixi.js'
import MultiStyleText from 'pixi-multistyle-text'
import _ from 'lodash'
import { ColorChangeableGraphic } from '../../utils'

class Character extends PIXI.Sprite {
  constructor (options, gamebase) {
    super()
    this.gamebase = gamebase
    // Just a shortcut
    this.app = this.gamebase.app

    this.options = _.merge({
      height: 400,
      width: 200,
      textures: {
        default: './img/bunny.png'
      }
    }, options)

    // center the sprite's anchor point
    this.anchor.set(0.5)

    this.dressing('default')
  }

  dressing (name) {
    if (this.options.textures[name]) {
      this.texture = PIXI.Texture.fromImage(this.options.textures[name])
    }
  }

  effect (name, value) {

  }
}

/**
 * An implement of a real character
 */
class BangBangBang extends Character {
  constructor (options, gamebase) {
    super({}, gamebase)
  }
}

class StageContainer extends PIXI.Container {
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
}

class SubtitleContainer extends PIXI.Container {
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
}

class ViewManager {
  constructor (script, provider) {
    this.script = script
    this.provider = provider

    // Just shortcuts
    this.stage = this.provider.stage
    this.subtitle = this.provider.subtitle

    // The cursor point to the script which is ready to load
    this.cursor = 0

    // init
    this.next()
  }

  next (event) {
    for (let pause = false; this.cursor < this.script.length && !pause; this.cursor++) {
      let statement = this.script[this.cursor]

      switch (statement.$type) {
        case 'command':
          // TODO...zzz
          break

        case 'act':
          let characters = []
          let message = statement.message
          for (let subjectMovement of statement.subjectMovementList.$array) {
            characters.push(subjectMovement.subject.name)
          }
          
          this.subtitle.push('<b>' + characters.join('、') + '：</b>\n' + message)
          pause = true
          break

        case 'header':
          // pause = true
          break

        default:
          throw new Error('ViewManager: Unknown statement type.')
      }
    }
  }
}

export default class ScriptDown extends PIXI.Container {
  constructor (script, gamebase) {
    super()
    this.script = script
    this.gamebase = gamebase
    this.app = this.gamebase.app

    this.app.stage.addChild(this)

    this.stage = new StageContainer({
      height: this.app.renderer.height,
      width: this.app.renderer.width
    }, this.gamebase)
    this.addChild(this.stage)

    this.stage.addCharacter('bang', new BangBangBang({}, this.gamebase))
    this.stage.addCharacter('bang1', new BangBangBang({}, this.gamebase))
    this.stage.addCharacter('bang2', new BangBangBang({}, this.gamebase))
    this.stage.selectCharacter('bang').x = 100
    this.stage.selectCharacter('bang').y = 100
    this.stage.selectCharacter('bang1').x = 200
    this.stage.selectCharacter('bang1').y = 200
    this.stage.selectCharacter('bang2').x = 300
    this.stage.selectCharacter('bang2').y = 300

    this.subtitle = new SubtitleContainer({
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
