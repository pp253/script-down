/*
import Router from './router'

window.GameBase = GameBase
window.Router = Router
*/

import GameBase from './base'

declare global {
  interface Window { GameBase: typeof GameBase }
}

window.GameBase = GameBase
