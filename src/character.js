import * as PIXI from 'pixi.js'
import _ from 'lodash'
import transition from '../../utils/transition'

export default class Character extends PIXI.Sprite {
  constructor (options, gamebase) {
    super()
    this.gamebase = gamebase
    // Just a shortcut
    this.app = this.gamebase.app

    this.options = _.defaultsDeep(options, {
      textures: {
        default: './img/bunny.png'
      },
      x: 200,
      y: 200,
      rotation: 0,
      scale: options.scale || 1,
      scaleX: options.scaleX || options.scale || 1,
      scaleY: options.scaleY || options.scale || 1,
      anchor: options.anchor || 0.5,
      anchorX: options.anchorX || options.anchor || 0.5,
      anchorY: options.anchorY || options.anchor || 0.5,
      pivot: options.pivot || 0.5,
      pivotX: options.pivotX || options.pivot || 0.5,
      pivotY: options.pivotY || options.pivot || 0.5
    })

    // Apply
    this.moveTo(this.options.x, this.options.y)
    this.rotateByDegree(this.options.rotation)
    this.changeScale(this.options.scale)
    this.changeScaleX(this.options.scaleX)
    this.changeScaleY(this.options.scaleY)
    this.changeAnchor(this.options.anchor)
    this.changeAnchorX(this.options.anchorX)
    this.changeAnchorY(this.options.anchorY)
    this.changePivot(this.options.pivot)
    this.changePivotX(this.options.pivotX)
    this.changePivotY(this.options.pivotY)

    // Default to disappear
    this.disappear()

    // Default texture
    this.changeTexture('default')
  }

  changeAnchor (anchor) {
    this.anchor.set(anchor)
  }

  changeAnchorX (x) {
    this.anchor.x = x
  }

  changeAnchorY (y) {
    this.anchor.y = y
  }

  changeScale (scale) {
    this.scale.x = scale
    this.scale.y = scale
  }

  changeScaleX (x) {
    this.scale.x = x
  }

  changeScaleY (y) {
    this.scale.y = y
  }

  changePivot (pivot) {
    this.pivot.set(pivot)
  }

  changePivotX (x) {
    this.pivot.x = x
  }

  changePivotY (y) {
    this.pivot.y = y
  }

  changeTexture (name) {
    if (this.options.textures[name]) {
      this.texture = PIXI.Texture.fromImage(this.options.textures[name])
    }
  }

  rotate (radius = 0, options) {
    let originalRadius = this.rotation

    let movement = function (t) {
      this.rotation = originalRadius + radius * t
    }.bind(this)

    let finalMovement = function () {
      this.rotation = originalRadius + radius
    }.bind(this)

    return transition(this.app, options, movement, finalMovement)
  }

  rotateByDegree (degree, options) {
    return this.rotate(degree * Math.PI / 180, options)
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
    let originalX = this.x
    let originalY = this.y

    let movement = function (t) {
      this.x = originalX + x * t
      this.y = originalY + y * t
    }.bind(this)

    let finalMovement = function () {
      this.x = originalX + x
      this.y = originalY + y
    }.bind(this)

    return transition(this.app, options, movement, finalMovement)
  }

  /**
   * Move to the point
   * @param {Number} x
   * @param {Number} y
   * @return {Promise}
   */
  moveTo (x, y, options) {
    return this.move(x - this.x, y - this.y, options)
  }

  /**
   * Shake the character
   * @param {Number} duration? The duration of shaking in millisecond
   * @param {Number} frequency? The frequency of shaking
   * @param {Number} amplitude? The amplitude of shaking
   * @return {Promise}
   */
  shake (duration = 400, frequency = 10, amplitude = 10) {
    if (typeof duration !== 'number') {
      duration = 400
    } else if (typeof frequency !== 'number') {
      frequency = 10
    } else if (typeof amplitude !== 'number') {
      amplitude = 10
    }

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
