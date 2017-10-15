import bezier from 'cubic-bezier'
import _ from 'lodash'

const TIMING_FUNCTION = {
  'linear': [0, 0, 1, 1],
  'ease': [0.25, 0.1, 0.25, 1],
  'ease-in': [0.42, 0, 1, 1],
  'ease-out': [0.0, 0, 1, 1],
  'ease-out-in': [0.42, 0, 0.58, 1],
  'ease-in-sine': [0.47, 0, 0.745, 0.715],
  'ease-out-sine': [0.39, 0.575, 0.565, 1],
  'ease-in-out-sine': [0.445, 0.05, 0.55, 0.95],
  'ease-in-quad': [0.55, 0.085, 0.68, 0.53],
  'ease-out-quad': [0.55, 0.085, 0.68, 0.53],
  'ease-in-out-quad': [0.455, 0.03, 0.515, 0.955],
  'ease-in-cubic': [0.55, 0.055, 0.675, 0.19],
  'ease-out-cubic': [0.215, 0.61, 0.355, 1],
  'ease-in-out-cubic': [0.645, 0.045, 0.355, 1],
  'ease-in-quart': [0.895, 0.03, 0.685, 0.22],
  'ease-out-quart': [0.165, 0.84, 0.44, 1],
  'ease-in-out-quart': [0.77, 0, 0.175, 1],
  'ease-in-quint': [0.755, 0.05, 0.855, 0.06],
  'ease-out-quint': [0.23, 1, 0.32, 1],
  'ease-in-out-quint': [0.86, 0, 0.07, 1],
  'ease-in-expo': [0.95, 0.05, 0.795, 0.035],
  'ease-out-expo': [0.19, 1, 0.22, 1],
  'ease-in-out-expo': [1, 0, 0, 1],
  'ease-in-circ': [0.6, 0.04, 0.98, 0.335],
  'ease-out-circ': [0.075, 0.82, 0.165, 1],
  'ease-in-out-circ': [0.785, 0.135, 0.15, 0.86],
  'ease-in-back': [0.6, -0.28, 0.735, 0.045],
  'ease-out-back': [0.175, 0.885, 0.32, 1.275],
  'ease-in-out-back': [0.68, -0.55, 0.265, 1.55]
}

export default function transition (app, options, movement, finalMovement) {
  if (!options || !options.duration) {
    movement(1)
    return Promise.resolve()
  }

  let duration = options.duration || 1000
  let timingFunction = options.transition || 'linear'

  let bezierPara = []
  if (TIMING_FUNCTION[timingFunction]) {
    bezierPara = _.clone(TIMING_FUNCTION[timingFunction])
  } else if (timingFunction.startsWith('cubic-bezier')) {
    let re = /^cubic-bezier\s*\(\s*([\d.]*)\s*,\s*([\d.]*)\s*,\s*([\d.]*)\s*,\s*([\d.]*)\s*\)\s*$/.exec(timingFunction)
    for (let i = 1; i < 5; i++) {
      bezierPara.push(parseFloat(re[i]))
    }
  } else {
    throw new SyntaxError('Transition: Invalid formet')
  }

  // Recommanded by https://www.npmjs.com/package/cubic-bezier
  let epsilon = duration * 2
  bezierPara.push(epsilon)

  let bezierFunction = bezier(...bezierPara)
  let now = Date.now()
  let f = () => {
    movement(bezierFunction((Date.now() - now) / duration))
  }

  return new Promise(function (resolve, reject) {
    app.ticker.add(f)
    setTimeout(function () {
      app.ticker.remove(f)
      if (finalMovement) {
        finalMovement()
      }
      resolve()
    }, duration)
  })
}
