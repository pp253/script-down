import _ from 'lodash'

/**
 * @param {Array} literal
 * @returns {Array}
 */
export default function structure (literal) {
  return FILE(literal)
}

function FILE (literal) {
  let struct = []

  for (let item of literal) {
    // STATEMENT
    if (item.$type === 'ACT') {
      struct.push(ACT(item))
    } else if (item.$type === 'COMMAND') {
      struct.push(COMMAND(item))
    } else if (item.$type === 'HEADER') {
      struct.push(HEADER(item))
    } else {
      throw new SyntaxError('STRUCTURE: Unknown statement')
    }
  }

  return struct
}

function HEADER (item) {
  let r = {}

  r.$type = 'HEADER'
  r.level = item.level
  r.title = item.title
  r.options = item.options && OPTIONS(item.options)

  return r
}

function COMMAND (item) {
  let r = {}

  r.$type = 'COMMAND'
  r.name = item.name
  r.argus = ARGUMENTS(item.argus)
  r.options = item.options && OPTIONS(item.options)

  return r
}

function ACT (item) {
  let r = {}

  r.$type = 'ACT'
  r.message = item.message
  r.subjectMovementList = SUBJECT_MOVEMENT_LIST(item.subjectMovementList)
  r.movement = item.movement && MOVEMENT(item.movement)

  return r
}

function SUBJECT_MOVEMENT_LIST (subjectMovementList) {
  let r = []
  for (let subjectMovement of subjectMovementList.$array) {
    r.push(SUBJECT_MOVEMENT(subjectMovement))
  }
  return r
}

function SUBJECT_MOVEMENT (subjectMovement) {
  let r = {}
  r.movement = MOVEMENT(subjectMovement.movement)
  r.subject = subjectMovement.subject
  return r
}

function MOVEMENT (movement) {
  let r = {}
  r.methods = METHODS(movement.methods)
  r.options = movement.options && OPTIONS(movement.options)
  return r
}

function METHODS (methods) {
  let r = []

  for (let method of methods) {
    if (method.$type === 'ACTION') {
      r.push(ACTION(method))
    } else if (method.$type === 'COMMAND') {
      r.push(COMMAND(method))
    } else {
      throw new Error('STURCTURE: Unknown method')
    }
  }

  return r
}

function ACTION (action) {
  let r = {}

  r.$type = 'ACTION'
  r.name = action.name
  r.argus = ARGUMENTS(action.argus)

  return r
}

function ARGUMENTS (argus) {
  let r = []
  for (let val of argus) {
    r.push(VALUE(val))
  }
  return r
}

function VALUE (value) {
  if (value.$type === 'array') {
    let arr = []
    for (let val of value.$array) {
      arr.push(VALUE(val))
    }
    return arr
  } else if (value.$type === 'object') {
    let arr = []
    for (let pair of value.$array) {
      arr.push(PAIR(pair, VALUE))
    }
    let obj = _.fromPairs(arr)
    return obj
  } else {
    return value['$' + value.$type]
  }
}

function PAIR (pair, type) {
  let r = [pair.name, type(pair.value)]
  return r
}

function OPTIONS (opt) {
  if (!opt.$array) {
    return
  }

  let arr = []
  for (let pair of opt.$array) {
    arr.push(PAIR(pair, VALUE))
  }
  let obj = _.fromPairs(arr)
  return obj
}
