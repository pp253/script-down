
export default class {
  constructor (gamebase, routes) {
    this.gamebase = gamebase

    // Just a shortcut
    this.app = this.gamebase.app

    this.routes = this.initRoutes(routes)

    this.history = []
  }

  initRoutes (routes) {
    for (let name in routes) {
      routes[name].component = routes[name].component(this)
    }
    return routes
  }

  /**
   * @param {String} name of the path
   * @param {Any} payload can be any type of data
   * @return {Promise}
   */
  push (name, payload, transition) {
    this.findRoute(name).onShow(payload, transition)
    this.history.push({
      name: name,
      payload: payload,
      transition: transition
    })
  }

  back () {
    if (this.history.length < 2) {
      return false
    }
    let last = this.history.pop()
    let last2 = this.history.pop()
    return this.push(last2.name, last2.payload, last.transition)
  }

  findRoute (name) {
    if (this.routes && this.routes[name]) {
      return this.routes[name].component
    } else {
      return false
    }
  }
}
