/**
 * Using * as PIXI because of the pixi.js's issue.
 * See more: https://github.com/pixijs/pixi.js/issues/3204
 */
import * as PIXI from 'pixi.js'

export default class {
  constructor (el = 'app', options) {
    /**
     * {String} this.el is the element Id that this.app.view appended on
     */
    this.el = el

    /**
     * {Array<Plugin>} this.plugins is the instnaces of the plugins added by this.use()
     */
    this.plugins = []

    /**
     * {Object} this.app is the instance of the PIXP.Application
     */
    this.app = new PIXI.Application(800, 600, {backgroundColor: 0x0})
    document.getElementById(el).appendChild(this.app.view)
  }

  /**
   * @param {Object} plugin should be a class with a constructor
   * @param {Any} options will directly pass to the second parameter of the Plugin
   * @return {Object} the new plugin
   */
  use (Plugin, options) {
    let newPlugin = new Plugin(this, options)
    this.plugins.push(newPlugin)
    return newPlugin
  }
}
