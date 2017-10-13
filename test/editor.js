/* global GameBase, Router, ScriptDown, parser */

let gamebase = null

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
    return new ScriptDown(script, gamebase)
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

let originalConsoleLog = console.log
let originalConsoleError = console.error

function log (...msg) {
  originalConsoleLog(...msg)
  document.getElementById('console').innerHTML += msg + '\n'
  document.getElementById('console').scrollTop = 10000000000
}

function error (...msg) {
  originalConsoleError(...msg)
  document.getElementById('console').value += msg + '\n'
  document.getElementById('console').scrollTop = 10000000000
}

// console.log = log
// console.error = error

document.getElementById('text').value = `// 456456

/* 45646 */

$com1

$com2(123, 456)

@cha1 msg1
@cha2 !action2
@cha3 !action3(123, 567)
@cha4 !action4 msg4

`

function update () {
  let text = document.getElementById('text').value
  let startTime = performance.now()
  try {
    parser(text)
    log(`Parsing is done (spending ${(performance.now() - startTime).toPrecision(4)} ms)`)
  } catch (e) {
    log(`Parsing failed!`)
    log(e)
  }
}

function reload () {
  initGameBase()
  log('Reload!')
}

window.onload = () => {
  initGameBase()
  log('')
  log('Welcome to ScriptDown Editor!')
  log('Get more information on GitHub')
}
