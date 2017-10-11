/* global GameBase, Router, ScriptDown */

let gamebase = null

initGameBase()

function initGameBase () {
  // refresh
  if (gamebase) {
    try {
      gamebase.destroy()
    } catch (e) {
      console.error(e)
    }
    gamebase = null
  }

  let fitWidth = window.innerWidth < 800 ? window.innerWidth - 20 : 800
  gamebase = new GameBase('app', {
    width: fitWidth,
    height: fitWidth * 3 / 4
  })

  let myScriptDown = (gamebase) => {
    let script = 'asdasdasd'
    return new ScriptDown(gamebase, script)
  }

  gamebase.use(Router, {
    'script-down': {
      component: myScriptDown,
      transition: {
        in: () => {},
        out: () => {}
      }
    }
  })
}

function reload () {
  initGameBase()
}
