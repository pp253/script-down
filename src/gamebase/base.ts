/**
 * Using * as PIXI because of the pixi.js's issue.
 * See more: https://github.com/pixijs/pixi.js/issues/3204
 */
import * as PIXI from 'pixi.js'
import * as _ from 'lodash'


interface Options {
  [propName: string]: any
}

interface GameBaseOptions extends Options {
  width?: number
  height?: number
}

const GameBaseDefaultOptions: GameBaseOptions = {
  width: 800,
  height: 600
}

interface Plugin {
  new(gamebase: GameBase, options: Options): Plugin
}

export default class GameBase {
  /**
   * {String} this.el is the element Id that this.app.view appended on
   */
  public el: string = 'app'

  public options: GameBaseOptions

  /**
   * {Array<Plugin>} this.plugins is the instnaces of the plugins added by this.use()
   */
  public plugins: Array<Plugin> = []

  public app: PIXI.Application

  constructor (el: string = 'app', options: GameBaseOptions) {
    this.el = el

    this.options = _.defaultsDeep(GameBaseDefaultOptions, options)

    this.plugins = []

    /**
     * {Object} this.app is the instance of the PIXP.Application
     */
    this.app = new PIXI.Application(this.options.width, this.options.height, {backgroundColor: 0x0})
    document.getElementById(this.el).appendChild(this.app.view)
  }

  /**
   * @param {Object} plugin should be a class with a constructor
   * @param {Any} options will directly pass to the second parameter of the Plugin
   * @return {Object} the new plugin
   */
  use (plugin: Plugin, options: Options) {
    let newPlugin = new plugin(this, options)
    this.plugins.push(newPlugin)
    return newPlugin
  }

  destroy () {
    console.log('destroy!!')
    this.app.destroy(true)
  }
}
