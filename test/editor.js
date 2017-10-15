/* eslint-disable */
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
    let text = document.getElementById('text').value
    let startTime = performance.now()
    let script = parser.parse(text)
    log(`Parsing is done (spending ${(performance.now() - startTime).toPrecision(4)} ms)`)
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
  document.getElementById('console').innerHTML += '\n' + msg
  document.getElementById('console').scrollTop = 10000000000
}

function error (...msg) {
  originalConsoleError(...msg)
  document.getElementById('console').value += '\n' + msg
  document.getElementById('console').scrollTop = 10000000000
}

// console.log = log
// console.error = error

document.getElementById('text').value = `
$character(Aimer, {
  textures: {
    default: './img/bunny.png'
  }
})
$character(Bimer, {
  textures: {
    default: './img/surval.png',
    bunny: './img/bunny.png'
  },
  scale: 0.5
})

// Lyrics of 茜さす
@Aimer <b>茜さす Akane Sasu</b>
{@Aimer, @Bimer} !appear 枯れ葉舞う町角を　駆け抜けてく乾いた風
@Bimer !move(456, 123) {duration: 1000, transition: 'ease-in-out-circ'} 伸びた影とイチョウ並木　季節を見てたかった
@Aimer 
@Aimer !shake {delay:1000} 返事のない呼ぶ声は　あっという間　かき消されてしまう
@Aimer !moveTo(456, 123) 目抜き通り　人波抜けて　どこか遠く　誰もいない場所へ
@Aimer 
@Bimer !appear !moveTo(100, 100) 気付いていたのに　何も知らないふり
@Aimer !shake 一人きりでは　何もできなかった
@Aimer 
@Aimer 出会えた幻にさよならを　茜さす　この空に
@Aimer 零れた弱さに手のひらを　一輪の徒花　そんなふうに
@Aimer 願い叶え　痛みを知る
@Aimer 
@Aimer 渡り鳥の鳴く声も　赤く染まる雲に消えてしまう
@Aimer 帰り道も遠く離れて　今は一人　誰もいない場所で
@Aimer 
@Aimer 気付いた景色の色にふれたとしても
@Aimer 一人きりでは　声も出せなかった
@Aimer 
@Aimer 愛した幻に口づけを　黄昏れた　この空に
@Aimer まだ夕べの星灯らない　待ち宵も朧げ　月は何処に
@Aimer 引き裂かれて　痛みを知る
@Aimer 
@Aimer くり返す日々の中で探してたのは
@Aimer 歩き続けるための願い
@Aimer 
@Aimer 出会えた幻にさよならを　憧れは　この空に
@Aimer 流れた月日を手のひらに　一片の花弁　そんなふうに
@Aimer 痛み重ね　出会いを知る
@Aimer 
@Aimer 出会い重ね　願いを知る
@Aimer <i>~ Ending ~</i>
`

function update () {
  try {
    initGameBase()
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
  log('Welcome to ScriptDown Editor!')
  log('Get more information by clicking "GITHUB & HELP".')
  log('')

  initGameBase()
}
