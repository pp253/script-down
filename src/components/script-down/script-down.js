/**
 * TODO
 * [ ] Add Space Listener
 */

import * as PIXI from 'pixi.js'
import MultiStyleText from 'pixi-multistyle-text'
import _ from 'lodash'
import { ColorChangeableGraphic, parseFlowControlOptions } from '../../utils'

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

    // Default to disappear
    this.disappear()

    this.dressing('default')
  }

  dressing (name) {
    if (this.options.textures[name]) {
      this.texture = PIXI.Texture.fromImage(this.options.textures[name])
    }
  }

  effect (name, value) {

  }

  appear () {
    this.visible = true
  }

  disappear () {
    this.visible = false
  }

  /**
   * @param {String} name
   * @param {any} value
   */
  set (name, value) {
    this[name] = value
  }

  /**
   * Move relatively
   * @param {Number} x
   * @param {Number} y
   * @return {Promise}
   */
  move (x, y, options) {
    this.x += x
    this.y += y
  }

  /**
   * Move to the point
   * @param {Number} x
   * @param {Number} y
   * @return {Promise}
   */
  moveTo (x, y, transition) {
    this.x = x
    this.y = y
  }

  /**
   * Shake the character
   * @param {Number} duration? The duration of shaking in millisecond
   * @param {Number} frequency? The frequency of shaking
   * @param {Number} amplitude? The amplitude of shaking
   * @return {Promise}
   */
  shake (duration = 400, frequency = 10, amplitude = 10) {
    let originalX = this.x
    let startTime = Date.now()

    let shaking = function () {
      this.x = originalX + (amplitude / 2) * Math.sin((Date.now() - startTime) / 500 * Math.PI * frequency)
    }.bind(this)

    this.app.ticker.add(shaking)

    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        this.app.ticker.remove(shaking)
        this.x = originalX
        resolve()
      }.bind(this), duration)
    }.bind(this))
  }
}

class Stage extends PIXI.Container {
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

class Subtitle extends PIXI.Container {
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

class ViewManager {
  /**
   *
   * @param {Array} script The ScriptDown Array parsed by parser
   * @param {ScriptDown} provider The instance of a ScriptDown
   */
  constructor (script, provider) {
    this.script = script
    this.provider = provider

    // Just shortcuts
    this.stage = this.provider.stage
    this.subtitle = this.provider.subtitle

    // The cursor point to the script which is ready to load
    this.cursor = 0

    // Waiting for next step, this will lock this.next()
    this.waiting = true

    // init
    this.next()
  }

  /**
   * Syntax in ScriptDown: $commandName(argus) {options}
   * @param {String} commandName
   * @param {Array} argus?
   * @param {Object} options?
   */
  command (commandName, argus, options) {
    return new Promise(function (resolve, reject) {
      if (commandName === 'character') {
        let characterName = argus[0]
        let characterOptions = argus[1] || {}

        this.stage.addCharacter(characterName, new Character(characterOptions, this.provider.gamebase))
      } else if (commandName === 'setStage') {
        let name = argus[0]
        let value = argus[1]

        this.stage.set(name, value)
      } else if (commandName === 'setSubtitle') {
        let name = argus[0]
        let value = argus[1]

        this.subtitle.set(name, value)
      } else {
        throw new Error('ViewManager: Undefined command')
      }

      // resolve???
      resolve()
    }.bind(this))
  }

  /**
   * action is an object-oriented method.
   * Syntax in ScriptDown: @objName $actionName(argus) {options}
   * @param {String} objName
   * @param {String} actionName
   * @param {Array} argus?
   * @param {Object} options?
   */
  action (objName, actionName, argus, options) {
    console.log('action!', objName, actionName)
    if (!this.stage.characters[objName]) {
      throw new Error(`ViewManager: Object "${objName}" is not defined`)
    }

    if (!this.stage.characters[objName][actionName]) {
      throw new Error(`ViewManager: Action "${objName}.${actionName}" is not defined`)
    }

    return this.stage.characters[objName][actionName](...argus)
  }

  next (event) {
    if (!this.waiting) {
      // still waiting
      return
    }

    let tasks = []
    let pause = false

    let delay = 0
    let proceed = false

    let transition = {}

    let postpone = 0
    let autostep = false

    for (; this.cursor < this.script.length && !pause; this.cursor++) {
      let statement = this.script[this.cursor]
      let options

      if (statement.$type === 'ACT') {
        options = statement.movement && statement.movement.options
        let charactersNameList = []
        let message = statement.message

        // multi movement
        let multiMovement = statement.movement

        // subjectMovement
        for (let subjectMovement of statement.subjectMovementList) {
          let singleOptions = _.defaultsDeep(subjectMovement.movement && subjectMovement.movement.options, options)

          // speakers
          charactersNameList.push(subjectMovement.subject.name)

          // variety
          if (subjectMovement.subject.variety) {
            tasks.push(function () {
              return this.action(subjectMovement.subject.name, 'changeTexture', subjectMovement.subject.variety, singleOptions)
            }.bind(this))
          }

          // single movement
          for (let method of subjectMovement.movement.methods) {
            switch (method.$type) {
              case 'ACTION':
                tasks.push(function () {
                  return this.action(subjectMovement.subject.name, method.name, method.argus, singleOptions)
                }.bind(this))
                break

              case 'COMMAND':
                tasks.push(function () {
                  return this.command(method.name, method.argus, singleOptions)
                }.bind(this))
                break

              default:
                throw new Error('ViewManager: Unknown method')
            }
          }
        }

        // multi methods
        if (multiMovement && multiMovement.methods) {
          for (let method of multiMovement.methods) {
            switch (method.$type) {
              case 'ACTION':
                for (let name of charactersNameList) {
                  this.action(name, method.name, method.argus, method.options)
                }
                break

              case 'COMMAND':
                this.command(method.name, method.argus, method.options)
                break

              default:
                throw new Error('ViewManager: Unknown method')
            }
          }
        }

        this.subtitle.push('<b>' + charactersNameList.join('、') + '：</b>\n' + message)
        pause = true
      } else if (statement.$type === 'COMMAND') {
        options = statement.options
        
        this.command(statement.name, statement.argus, statement.options)
      } else if (statement.$type === 'HEADER') {
        options = statement.options
        pause = true
      } else {
        throw new Error('ViewManager: Unknown statement type.')
      }

      // analyze options
      if (options) {
        pause = options.pause || pause
        delay = options.delay || delay
        proceed = options.proceed || proceed
        transition = options.transition || transition
        postpone = options.postpone || postpone
        autostep = options.autostep || autostep
      }
    }

    // proceed
    this.waiting = proceed

    // delay
    setTimeout(function () {
      let startingTasks = []

      for (let task of tasks) {
        startingTasks.push(task())
      }

      Promise.all(startingTasks)
        .then(function () {
          // postpone
          setTimeout(function () {
            this.waiting = true

            // autostep
            if (autostep) {
              this.next()
            }
          }.bind(this), postpone)
        }.bind(this))
    }.bind(this), delay)
  }
}

export default class ScriptDown extends PIXI.Container {
  constructor (script, gamebase) {
    super()

    this.script = script
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
