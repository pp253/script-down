/* eslint-disable no-extra-bind */
import Character from './character'

export default class ViewManager {
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
    if (!this.stage.characters[objName]) {
      throw new Error(`ViewManager: Object "${objName}" is not defined`)
    }

    if (!this.stage.characters[objName][actionName]) {
      throw new Error(`ViewManager: Action "${objName}.${actionName}" is not defined`)
    }

    argus.push(options)
    return this.stage.characters[objName][actionName](...argus)
  }

  next (event) {
    if (!this.waiting) {
      // still waiting
      console.log('still waiting')
      return
    }

    let tasks = []
    let pause = false

    let delay = 0
    let proceed = false

    let postpone = 0
    let autostep = false

    for (; this.cursor < this.script.length && !pause; this.cursor++) {
      let statement = this.script[this.cursor]
      let options

      if (statement.$type === 'ACT') {
        if (statement.movement) {
          options = statement.movement && statement.movement.options
        } else if (statement.subjectMovementList.length === 1) {
          let head = statement.subjectMovementList[0].movement.options
          if (head) {
            options = {}
            options.pause = head.pause
            options.proceed = head.proceed
            options.autostep = head.autostep
          }
        }
        let singleTasksList = []
        let charactersNameList = []
        let message = statement.message

        // subjectMovement
        for (let subjectMovement of statement.subjectMovementList) {
          let singleOptions = (subjectMovement.movement && subjectMovement.movement.options) || {}
          // single movement
          let singleTasks = []

          // speakers
          charactersNameList.push(subjectMovement.subject.name)

          // variety
          if (subjectMovement.subject.variety) {
            singleTasks.push(function () {
              return this.action(subjectMovement.subject.name, 'changeTexture', [subjectMovement.subject.variety], singleOptions)
            }.bind(this))
          }

          for (let method of subjectMovement.movement.methods) {
            switch (method.$type) {
              case 'ACTION':
                singleTasks.push(function () {
                  return this.action(subjectMovement.subject.name, method.name, method.argus, singleOptions)
                }.bind(this))
                break

              case 'COMMAND':
                singleTasks.push(function () {
                  return this.command(method.name, method.argus, singleOptions)
                }.bind(this))
                break

              default:
                throw new Error('ViewManager: Unknown method')
            }
          }

          singleTasksList.push(function () {
            return new Promise(function (resolve, reject) {
              // delay
              setTimeout(function () {
                let startingTasks = [Promise.resolve]

                for (let task of singleTasks) {
                  startingTasks.push(task())
                }

                // proceed
                if (singleOptions.proceed) {
                  resolve()
                } else {
                  Promise.all(startingTasks)
                  .then(function () {
                    // postpone
                    setTimeout(function () {
                      resolve()
                    }.bind(this), singleOptions.postpone || 0)
                  }.bind(this))
                }
              }, singleOptions.delay || 0)
            }.bind(this))
          }.bind(this))
        }

        // multi tasks
        let multiTasksList = []

        // multi movement
        let multiMovement = statement.movement

        // multi methods
        if (multiMovement && multiMovement.methods) {
          for (let method of multiMovement.methods) {
            switch (method.$type) {
              case 'ACTION':
                for (let name of charactersNameList) {
                  multiTasksList.push(function () {
                    return this.action(name, method.name, method.argus, options)
                  }.bind(this))
                }
                break

              case 'COMMAND':
                multiTasksList.push(function () {
                  return this.command(method.name, method.argus, options)
                }.bind(this))
                break

              default:
                throw new Error('ViewManager: Unknown method')
            }
          }
        }

        multiTasksList.push(function () {
          return this.subtitle.push('<b>' + charactersNameList.join('、') + '：</b>\n' + message)
        }.bind(this))

        tasks.push(function () {
          return new Promise(function (resolve, reject) {
            let startingTasks = [Promise.resolve]

            for (let task of singleTasksList) {
              startingTasks.push(task())
            }

            Promise.all(startingTasks)
              .then(function () {
                let startingTasks = []

                for (let task of multiTasksList) {
                  startingTasks.push(task())
                }

                Promise.all(startingTasks)
                  .then(function () {
                    resolve()
                  })
              }.bind(this))
          }.bind(this))
        }.bind(this))

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

      // proceed
      if (proceed) {
        // autostep
        if (autostep) {
          this.next()
        }
      } else {
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
      }
    }.bind(this), delay)
  }
}
