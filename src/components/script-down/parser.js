/**
 * FILE = REDUNDENT + STATEMENT*
 */
function FILE (text, i, list) {
  console.log('FILE', i, text.slice(i, i + 5).replace(/\n/g, '\\n'))
  let c = i
  c = REDUNDENT(text, c)
  let tmp = c
  while (c < text.length) {
    c = STATEMENT(text, c, list)
    if (c === tmp) {
      // No more statements
      break
    }
    tmp = c
  }
  if (c < text.length) {
    throw new SyntaxError('FILE: Not ending properly.')
  }
}

/**
 * STATEMENT = COMMAND | HEADER | ACT
 */
function STATEMENT (text, i, list) {
  console.log('STATEMENT', i, text.slice(i, i + 5).replace(/\n/g, '\\n'))
  let c = i
  let tmp = c

  // COMMAND
  c = COMMAND(text, c, list)
  if (c !== tmp) {
    return c
  }

  // HEADER
  c = HEADER(text, c, list)
  if (c !== tmp) {
    return c
  }

  // ACT
  c = ACT(text, c, list)
  if (c !== tmp) {
    return c
  }

  throw new SyntaxError('STATEMENT: No such statement.')
}

/**
 * COMMAND = '$' + NAME + REDUNDENT + ARGUMENTS? + OPTIONS? + REDUNDENT
 */
function COMMAND (text, i, list) {
  console.log('COMMAND', i, text.slice(i, i + 5).replace(/\n/g, '\\n'))
  let c = i

  if (text[c] === '$') {
    // '$'
    c++

    // NAME
    let name = {}
    c = NAME(text, c, name)

    // REDUNDENT
    c = REDUNDENT(text, c)

    // ARGUMENTS?
    let argus = []
    c = ARGUMENTS(text, c, argus)

    // OPTIONS?
    let opt = {}
    c = OPTIONS(text, c, opt)

    // REDUNDENT
    c = REDUNDENT(text, c)

    list.push({
      type: 'command',
      name: name.$string,
      argus: argus,
      options: opt
    })
  }

  return c
}

/**
 * HEADER = '#'* + REDUNDENT + TITLE + REDUNDENT + OPTIONS
 */
function HEADER (text, i, list) {
  console.log('HEADER', i, text.slice(i, i + 5).replace(/\n/g, '\\n'))
  let c = i

  if (text[c] === '#') {
    // '#'*
    c++
    let level = 1
    for (; c < text.length && text[c] === '#'; c++) {
      level++
    }

    // REDUNDENT
    c = REDUNDENT(text, c)

    // TITLE
    let title = {}
    c = TITLE(text, c, title)

    // REDUNDENT
    c = REDUNDENT(text, c)

    // OPTIONS
    let opt = {}
    c = OPTIONS(text, c, opt)

    list.push({
      type: 'header',
      level: level,
      name: title.$string,
      options: opt
    })
  }

  return c
}

/**
 * ACT = (SUBJECT | (SUBJECT_GROUP +  + OPTIONS)) + MESSAGE:TITLE? + REDUNDENT
 */
function ACT (text, i, list) {
  console.log('ACT', i, text.slice(i, i + 5).replace(/\n/g, '\\n'))
  let c = i
  let tmp = c

  let objects = {}

  // SUBJECT
  c = COMMAND(text, c, list)
  if (c !== tmp) {
    return c
  }

  list.push({
    type: 'act',
    objects: objects,
    message: message,
    options: opt,

  })
}

/**
 * SUBJECT = '@' + OBJECT_NAME:NAME + (ACTION | COMMAND)*
 */

/**
 * ACTION = '!' + ACTION_NAME:NAME + REDUNDENT+ ARGUMENTS? + OPTIONS? + REDUNDENT
 */
function ACTION (text, i, list) {

}

/**
 * ARGUMENTS = '(' + PARAMETERS + ')' + REDUNDENT
 */
function ARGUMENTS (text, i, argus) {
  console.log('ARGUMENTS', i, text.slice(i, i + 5).replace(/\n/g, '\\n'))
  let c = i
  if (text[c] === '(') {
    c++
    c = PARAMETERS(text, c, argus)
    if (text[c] === ')') {
      c++
      return c
    } else {
      throw new SyntaxError('ARGUMENTS: Not ending with ).')
    }
  }
  c = REDUNDENT(text, c)
  return c
}

/**
 * PARAMETERS = RUNDUNDENT + VALUE + RUNDUNDENT + (',' + PARAMETERS)?
 */
function PARAMETERS (text, i, argus) {
  console.log('PARAMETERS', i, text.slice(i, i + 5).replace(/\n/g, '\\n'))
  let c = i

  // RUNDUNDENT
  c = REDUNDENT(text, c)

  // VALUE
  let value = {}
  c = VALUE(text, c, value)
  argus.push(value)

  // (',' + PARAMETERS)?
  if (text[c] === ',') {
    // PARAMETERS
    c++
    c = PARAMETERS(text, c, argus)
  }
  return c
}

/**
 * VALUE = STRING | NUMBER | BOOLEAN | ARRAY | OBJECT
 */
function VALUE (text, i, value) {
  console.log('VALUE', i, text.slice(i, i + 5).replace(/\n/g, '\\n'))
  let c = i
  let tmp = c

  // STRING
  c = STRING(text, c, value)
  if (c !== tmp) {
    return c
  }

  // NUMBER
  c = NUMBER(text, c, value)
  if (c !== tmp) {
    return c
  }

  throw new SyntaxError('VALUE: Not a value')
}

/**
 * STRING = ("'" + ... + "'" | '"' + ... + '"') + REDUNDENT
 */
function STRING (text, i, value) {
  console.log('STRING', i, text.slice(i, i + 5).replace(/\n/g, '\\n'))
  let c = i
  if (text[c] === "'" || text[c] === '"') {
    let str = ''
    let target = text[c]
    // ("'" + ... + "'" | '"' + ... + '"')
    c++
    for (; c < text.length && text[c] !== target; c++) {
      str += text[c]
    }
    c++
    value.$string = str

    // RUNDUNDENT
    c = REDUNDENT(text, c)
  }
  return c
}

/**
 * NUMBER = \d* + ('.' + \d*)? + REDUNDENT
 */
function NUMBER (text, i, value) {
  console.log('NUMBER', i, text.slice(i, i + 5).replace(/\n/g, '\\n'))
  let c = i
  let number = 0

  if (text[c] === '0') {
    // 0 | 0.x
    number = 0
    c++
  } else if (/[1-9]/.test(text[c])) {
    // 1-9
    for (; c < text.length && /[\d]/.test(text[c]); c++) {
      number = number * 10 + parseInt(text[c])
    }
  } else {
    throw new SyntaxError('NUMBER: Not a number.')
  }

  // Floating
  if (text[c] === '.') {
    c++
    let float = 0
    let expo = 0
    for (; c < text.length && /[\d]/.test(text[c]); c++) {
      float = float * 10 + parseInt(text[c])
      expo++
    }
    number += float / Math.pow(10, expo)
  }

  value.$number = number

  // RUNDUNDENT
  c = REDUNDENT(text, c)
  return c
}

/**
 * OPTIONS = '{' + PAIRS + '}'
 */
function OPTIONS (text, i, opt) {
  console.log('OPTIONS', i, text.slice(i, i + 5).replace(/\n/g, '\\n'))
  let c = i

  if (text[c] === '{') {
    // '{'
    c++

    // PAIRS
    c = PAIRS(text, i, opt)

    // '}'
    if (text[c] === '}') {
      c++
      return c
    }

    throw new SyntaxError('OPTIONS: Not end with "}"')
  }

  return c
}

/**
 * PAIRS = REDUNDENT + NAME + REDUNDENT + ':' + REDUNDENT + VALUE + REDUNDENT + (',' + PAIRS)?
 */
function PAIRS (text, i, opt) {
  console.log('PAIR', i, text.slice(i, i + 5).replace(/\n/g, '\\n'))
  let c = i

  // REDUNDENT
  c = REDUNDENT(text, c)

  // NAME
  let name = {}
  c = NAME(text, c, name)

  // REDUNDENT
  c = REDUNDENT(text, c)

  if (text[c] === ':') {
    // ':'
    c++
  } else {
    throw new SyntaxError('PAIRS: ":" should behind the name')
  }

  // REDUNDENT
  c = REDUNDENT(text, c)

  // VALUE
  let value = {}
  c = VALUE(text, c, value)

  // REDUNDENT
  c = REDUNDENT(text, c)

  opt[name.$string] = value

  // (',' + PAIRS)?
  if (text[c] === ',') {
    c++
    c = PAIRS(text, c, opt)
  }

  return c
}

/**
 * NAME = /[a-zA-Z0-9]/*
 */
function NAME (text, i, name) {
  console.log('NAME', i, text.slice(i, i + 5).replace(/\n/g, '\\n'))
  let c = i
  let str = ''

  // /[a-zA-Z0-9]/*
  for (; c < text.length && /[a-zA-Z\d]/.test(text[c]); c++) {
    str += text[c]
  }

  name.$string = str
  return c
}

/**
 * TITLE = /[^\n{]/*
 */
function TITLE (text, i, title) {
  console.log('TITLE', i, text.slice(i, i + 5).replace(/\n/g, '\\n'))
  let c = i
  let str = ''

  // /[^\n{]/*
  for (; c < text.length && /[^\n{]/.test(text[c]); c++) {
    str += text[c]
  }

  title.$string = str
  return c
}

/**
 * GROUP = SEQUENTIAL_GROUP | SIMULTANEOUS_GROUP
 */
function GROUP (text, i, group) {
  console.log('GROUP', i, text.slice(i, i + 5).replace(/\n/g, '\\n'))
  let c = i
  let tmp = c

  // SEQUENTIAL_GROUP
  c = SEQUENTIAL_GROUP(text, c, group)
  if (c !== tmp) {
    return c
  }

  // SIMULTANEOUS_GROUP
  c = SIMULTANEOUS_GROUP(text, c, group)
  if (c !== tmp) {
    return c
  }

  throw new SyntaxError('GROUP: Not a valid group')
}

/**
 * SEQUENTIAL_GROUP = '[' + PARAMETERS + ']'
 */

/**
 * SUBJECT | ACTION | COMMAND
 */

/**
 * REDUNDENT = SPACES_OR_NEWLINE (+ COMMENT + REDUNDENT)?
 * COMMENT = INLINE_COMMENT | BLOCK_COMMENTS
 */
function REDUNDENT (text, i) {
  console.log('REDUNDENT', i, text.slice(i, i + 5).replace(/\n/g, '\\n'))
  let c = i
  // SPACES_OR_NEWLINE
  while (c < text.length && (text[c] === ' ' || text[c] === '\n')) { c++ }

  // (+ COMMENT + REDUNDENT)?
  if (text[c] === '/') {
    c++
    // COMMENT
    if (text[c] === '/') {
      // INLINE_COMMENT
      while (c < text.length && (text[c] !== '\n')) { c++ }
    } else if (text[c] === '*') {
      // BLOCK_COMMENTS
      c++
      while (c < text.length && (text[c] !== '*' && text[c + 1] !== '/')) { c++ }
      c += 2
    } else {
      // wrong
      c--
      return c
    }

    // REDUNDENT
    return REDUNDENT(text, c)
  } else {
    return c
  }
}

export default function parse (text) {
  console.log('parse', 'text length:', text.length)
  let list = []
  FILE(text, 0, list)
  console.log(list)
}
