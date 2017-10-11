/* global GameBase, Router, ScriptDown */

let gamebase = new GameBase()

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
