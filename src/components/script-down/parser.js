/**
 * KEYWORD: !, @, #, {}, (), []
 * Prepare for Chinese
 */
const REGEXP_SPACE = /[\s]/
const REGEXP_NAWLINE = /\n/
const REGEXP_NAWLINE_G = /\n/g
const REGEXP_NAME = /[^\\\s\n\t()[\]{}`'+\-*/~!@#$%^&?,.:]/
const REGEXP_TITLE = /[^\n{}[\]!@#$%]/
const REGEXP_DIGIT = /[\d]/
const REGEXP_ZERO = /[0]/
const REGEXP_COLON = /[:]/
const REGEXP_LEFT_ROUND = /[(]/
const REGEXP_RIGHT_ROUND = /[)]/
const REGEXP_LEFT_SQUARE = /[[]/
const REGEXP_RIGHT_SQUARE = /[\]]/
const REGEXP_LEFT_CURLY = /[{]/
const REGEXP_RIGHT_CURLY = /[}]/
const REGEXP_SLASH = /[/]/
const REGEXP_STAR = /[*]/
const REGEXP_DOLLAR = /[$]/
const REGEXP_HASH = /[#]/
const REGEXP_AT = /[@]/
const REGEXP_EXCLAMATION = /[!]/
const REGEXP_LESSTHAN = /[<]/
const REGEXP_GREATERTHAN = /[>]/
const REGEXP_COMMA = /[,]/
const REGEXP_SINGLE_QUOTES = /[']/
const REGEXP_DOUBLE_QUOTES = /["]/

/**
 * FILE = REDUNDENT + STATEMENT*
 */
function FILE (text, i, list) {
  console.log('FILE', i, text.slice(i, i + 5).replace(REGEXP_NAWLINE_G, '\\n'))
  let c = i
  c = REDUNDENT(text, c)
  let tmp = c
  while (c < text.length) {
    let statement = {}
    c = STATEMENT(text, c, statement)
    if (c === tmp) {
      // No more statements
      break
    }
    list.push(statement)
    tmp = c
  }
  if (c < text.length) {
    throw new SyntaxError('FILE: Not ending properly.')
  }
}

/**
 * STATEMENT = COMMAND | HEADER | ACT + OPTIONS?
 */
function STATEMENT (text, i, statement) {
  console.log('STATEMENT', i, text.slice(i, i + 5).replace(REGEXP_NAWLINE_G, '\\n'))
  let c = i
  let tmp = c

  // COMMAND
  c = COMMAND(text, c, statement)
  if (c !== tmp) {
    // OPTIONS?
    let opt = {}
    c = OPTIONS(text, c, opt)
    statement.options = opt
    return c
  }

  // HEADER
  c = HEADER(text, c, statement)
  if (c !== tmp) {
    // OPTIONS?
    let opt = {}
    c = OPTIONS(text, c, opt)
    statement.options = opt
    return c
  }

  // ACT
  c = ACT(text, c, statement)
  if (c !== tmp) {
    return c
  }

  throw new SyntaxError('STATEMENT: No such statement.')
}

/**
 * COMMAND = ('$' + NAME + REDUNDENT + ARGUMENTS?)?
 */
function COMMAND (text, i, command) {
  console.log('COMMAND', i, text.slice(i, i + 5).replace(REGEXP_NAWLINE_G, '\\n'))
  let c = i

  if (REGEXP_DOLLAR.test(text[c])) {
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

    command.$type = 'command'
    command.name = name.$string
    command.argus = argus
  }

  return c
}

/**
 * HEADER = ('#'+ + REDUNDENT + TITLE?)?
 * @param {Object} header
 */
function HEADER (text, i, header) {
  console.log('HEADER', i, text.slice(i, i + 5).replace(REGEXP_NAWLINE_G, '\\n'))
  let c = i

  if (REGEXP_HASH.test(text[c])) {
    // '#'*
    c++
    let level = 1
    for (; c < text.length && REGEXP_HASH.test(text[c]); c++) {
      level++
    }

    // REDUNDENT
    c = REDUNDENT(text, c)

    // TITLE
    let title = {}
    c = TITLE(text, c, title)

    // REDUNDENT
    c = REDUNDENT(text, c)

    header.$type = 'header'
    header.level = level
    header.title = title.$string
  }

  return c
}

/**
 * ACT = (((SIMULTANEOUS_GROUP<SUBJECT_MOVEMENT> + MOVEMENT?) | SUBJECT_MOVEMENT) + MESSAGE:TITLE?)?
 * @param {Object} act
 */
function ACT (text, i, act) {
  console.log('ACT', i, text.slice(i, i + 5).replace(REGEXP_NAWLINE_G, '\\n'))
  let c = i
  let tmp = c

  // (SIMULTANEOUS_GROUP<SUBJECT_MOVEMENT> + MOVEMENT?)
  let subjectMovementList = []
  c = SIMULTANEOUS_GROUP(text, c, SUBJECT_MOVEMENT, subjectMovementList)
  if (c !== tmp) {
    // MOVEMENT?
    let movement = []
    c = MOVEMENT(text, c, movement)
    act.movement = movement
  } else {
    // SUBJECT_MOVEMENT
    c = SUBJECT_MOVEMENT(text, c, subjectMovementList)

    if (c === tmp) {
      // Not a SUBJECT_MOVEMENT; therefore, not an ACT
      return c
    }
  }

  // MESSAGE:TITLE?
  let message = {}
  c = TITLE(text, c, message)

  act.$type = 'act'
  act.subjectMovementList = subjectMovementList
  act.message = message.$string

  return c
}

/**
 * SUBJECT_MOVEMENT = SUBJECT + MOVEMENT?
 * @param {Object} subjectMovement
 */
function SUBJECT_MOVEMENT (text, i, subjectMovementList) {
  console.log('SUBJECT_MOVEMENT', i, text.slice(i, i + 5).replace(REGEXP_NAWLINE_G, '\\n'))
  let c = i

  let subjectMovement = {}

  // SUBJECT
  let subject = {}
  c = SUBJECT(text, c, subject)

  // MOVEMENT?
  let movement = []
  c = MOVEMENT(text, c, movement)

  subjectMovement.$type = 'subjectMovement'
  subjectMovement.subject = subject
  subjectMovement.movement = movement
  subjectMovementList.push(subjectMovement)

  return c
}

/**
 * SUBJECT = ('@' + OBJECT_NAME:NAME + REDUNDENT + VARIETY?)?
 * @param {Object} subject
 */
function SUBJECT (text, i, subject) {
  console.log('SUBJECT', i, text.slice(i, i + 5).replace(REGEXP_NAWLINE_G, '\\n'))
  let c = i

  if (REGEXP_AT.test(text[c])) {
    // '@'
    c++

    // NAME
    let name = {}
    c = NAME(text, c, name)

    // REDUNDENT
    c = REDUNDENT(text, c)

    // VARIETY?
    let variety = {}
    c = VARIETY(text, c, variety)

    subject.$type = 'subject'
    subject.name = name.$string
    subject.variety = variety.$string
  }

  return c
}

/**
 * VARIETY = ('<' + REDUNDENT + NAME + REDUNDENT + '>' + REDUNDENT)?
 * @param {Object} variety
 */
function VARIETY (text, i, variety) {
  console.log('VARIETY', i, text.slice(i, i + 5).replace(REGEXP_NAWLINE_G, '\\n'))
  let c = i

  if (REGEXP_LESSTHAN.test(text[c])) {
    // '<'
    c++

    // REDUNDENT
    c = REDUNDENT(text, c)

    // NAME
    c = NAME(text, c, variety)

    // REDUNDENT
    c = REDUNDENT(text, c)

    // '>'
    if (REGEXP_GREATERTHAN.test(text[c])) {
      throw new SyntaxError('VARIETY: Missing ">"')
    }
    c++

    // REDUNDENT
    c = REDUNDENT(text, c)
  }

  return c
}

/**
 * MOVEMENT = (METHOD* + OPTIONS?)?
 * @param {Array} movement
 */
function MOVEMENT (text, i, movement) {
  console.log('MOVEMENT', i, text.slice(i, i + 5).replace(REGEXP_NAWLINE_G, '\\n'))
  let c = i
  let tmp = c

  // METHOD*
  let methods = []
  while (c < text.length) {
    let method = {}
    c = METHOD(text, c, method)
    if (c === tmp) {
      // No more METHODs
      break
    }
    methods.push(method)
    tmp = c
  }

  // OPTION?
  let opt = {}
  c = OPTIONS(text, c, opt)

  movement.$type = 'movement'
  movement.methods = methods
  movement.options = opt

  return c
}

/**
 * METHOD = ACTION | COMMAND
 */
function METHOD (text, i, method) {
  console.log('METHOD', i, text.slice(i, i + 5).replace(REGEXP_NAWLINE_G, '\\n'))
  let c = i
  let tmp = c

  // ACTION
  c = ACTION(text, c, method)
  if (c !== tmp) {
    return c
  }

  // COMMAND
  c = COMMAND(text, c, method)
  if (c !== tmp) {
    return c
  }

  return c
}

/**
 * ACTION = '!' + NAME + REDUNDENT + ARGUMENTS?
 * @param {Object} action
 */
function ACTION (text, i, action) {
  console.log('ACTION', i, text.slice(i, i + 5).replace(REGEXP_NAWLINE_G, '\\n'))
  let c = i

  if (REGEXP_EXCLAMATION.test(text[c])) {
    // '!'
    c++

    // NAME
    let name = {}
    c = NAME(text, c, name)

    // REDUNDENT
    c = REDUNDENT(text, c)

    // ARGUMENTS?
    let argus = []
    c = ARGUMENTS(text, c, argus)

    action.$type = 'action'
    action.name = name.$string
    action.argus = argus
  }

  return c
}

/**
 * ARGUMENTS = ('(' + PARAMETERS<VALUE> + ')' + REDUNDENT)?
 */
function ARGUMENTS (text, i, arr) {
  console.log('ARGUMENTS', i, text.slice(i, i + 5).replace(REGEXP_NAWLINE_G, '\\n'))
  let c = i
  if (REGEXP_LEFT_ROUND.test(text[c])) {
    // '('
    c++

    // PARAMETERS<VALUE>
    c = PARAMETERS(text, c, VALUE, arr)

    // ')'
    if (!REGEXP_RIGHT_ROUND.test(text[c])) {
      throw new SyntaxError('ARGUMENTS: Missing ")"')
    }
    c++

    // REDUNDENT
    c = REDUNDENT(text, c)

    return c
  }

  return c
}

/**
 * PARAMETERS<T> = RUNDUNDENT + T + RUNDUNDENT + (',' + PARAMETERS<T>)?
 * @param {Object | Array} obj
 */
function PARAMETERS (text, i, type, arr) {
  console.log(`PARAMETERS<${type.name}>`, i, text.slice(i, i + 5).replace(REGEXP_NAWLINE_G, '\\n'))
  let c = i

  // RUNDUNDENT
  c = REDUNDENT(text, c)

  // VALUE
  let value = {}
  c = type(text, c, value)
  arr.push(value)

  // (',' + PARAMETERS)?
  if (REGEXP_COMMA.test(text[c])) {
    // PARAMETERS
    c++
    c = PARAMETERS(text, c, type, arr)
  }
  return c
}

/**
 * VALUE = NUMBER | STRING | NAME | BOOLEAN | ARRAY | OBJECT
 * @param {Object} value
 */
function VALUE (text, i, value) {
  console.log('VALUE', i, text.slice(i, i + 5).replace(REGEXP_NAWLINE_G, '\\n'))
  let c = i
  let tmp = c

  // NUMBER
  c = NUMBER(text, c, value)
  if (c !== tmp) {
    return c
  }

  // STRING
  c = STRING(text, c, value)
  if (c !== tmp) {
    return c
  }

  // NAME
  c = NAME(text, c, value)
  if (c !== tmp) {
    return c
  }

  throw new SyntaxError('VALUE: Not a value')
}

/**
 * STRING = ("'" + ... + "'" | '"' + ... + '"')
 */
function STRING (text, i, value) {
  console.log('STRING', i, text.slice(i, i + 5).replace(REGEXP_NAWLINE_G, '\\n'))
  let c = i
  if (REGEXP_SINGLE_QUOTES.test(text[c]) || REGEXP_DOUBLE_QUOTES.test(text[c])) {
    let str = ''
    let target = text[c]
    // ("'" + ... + "'" | '"' + ... + '"')
    c++
    for (; c < text.length && text[c] !== target; c++) {
      str += text[c]
    }
    c++
    value.$string = str
  }
  return c
}

/**
 * NUMBER = \d* + ('.' + \d*)?
 */
function NUMBER (text, i, value) {
  console.log('NUMBER', i, text.slice(i, i + 5).replace(REGEXP_NAWLINE_G, '\\n'))
  let c = i
  let number = 0

  if (REGEXP_ZERO.test(text[c])) {
    // 0 | 0.x
    number = 0
    c++
  } else if (REGEXP_DIGIT.test(text[c])) {
    // 1-9
    for (; c < text.length && REGEXP_DIGIT.test(text[c]); c++) {
      number = number * 10 + parseInt(text[c])
    }
  } else {
    // Not a number
    return c
  }

  // Floating
  if (text[c] === '.') {
    c++
    let float = 0
    let expo = 0
    for (; c < text.length && REGEXP_DIGIT.test(text[c]); c++) {
      float = float * 10 + parseInt(text[c])
      expo++
    }
    number += float / Math.pow(10, expo)
  }

  value.$number = number

  return c
}

/**
 * OPTIONS = SIMULTANEOUS_GROUP<PAIR> + REDUNDENT
 */
function OPTIONS (text, i, opt) {
  console.log('OPTIONS', i, text.slice(i, i + 5).replace(REGEXP_NAWLINE_G, '\\n'))
  let c = i

  // SIMULTANEOUS_GROUP<PAIR>
  c = SIMULTANEOUS_GROUP(text, c, PAIR, opt)

  // REDUNDENT
  c = REDUNDENT(text, c)

  return c
}

/**
 * PAIR = NAME + REDUNDENT + ':' + REDUNDENT + VALUE
 */
function PAIR (text, i, pair) {
  console.log('PAIR', i, text.slice(i, i + 5).replace(REGEXP_NAWLINE_G, '\\n'))
  let c = i

  // NAME
  let name = {}
  c = NAME(text, c, name)

  // REDUNDENT
  c = REDUNDENT(text, c)

  if (REGEXP_COLON.test(text[c])) {
    // ':'
    c++
  } else {
    throw new SyntaxError('PAIR: Missing ":" should behind the name')
  }

  // REDUNDENT
  c = REDUNDENT(text, c)

  // VALUE
  let value = {}
  c = VALUE(text, c, value)

  // REDUNDENT
  c = REDUNDENT(text, c)

  pair.name = name.$string
  pair.value = value

  return c
}

/**
 * NAME = /[^\s\n\t{}[\]!@#$%?]/*
 * @param {Object} name, add on name.$string
 */
function NAME (text, i, name) {
  console.log('NAME', i, text.slice(i, i + 5).replace(REGEXP_NAWLINE_G, '\\n'))
  let c = i
  let str = ''

  // /[a-zA-Z0-9]/*
  for (; c < text.length && REGEXP_NAME.test(text[c]); c++) {
    str += text[c]
  }

  name.$string = str
  return c
}

/**
 * TITLE = /[^\n{]/* + REDUNDENT
 */
function TITLE (text, i, title) {
  console.log('TITLE', i, text.slice(i, i + 5).replace(REGEXP_NAWLINE_G, '\\n'))
  let c = i
  let str = ''

  // /[^\n{]/*
  for (; c < text.length && REGEXP_TITLE.test(text[c]); c++) {
    str += text[c]
  }
  title.$string = str

  // REDUNDENT
  c = REDUNDENT(text, c)

  return c
}

/**
 * GROUP<T> = SEQUENTIAL_GROUP<T> | SIMULTANEOUS_GROUP<T>
 */
function GROUP (text, i, type, group) {
  console.log(`GROUP<${type.name}>`, i, text.slice(i, i + 5).replace(REGEXP_NAWLINE_G, '\\n'))
  let c = i
  let tmp = c

  // SEQUENTIAL_GROUP
  c = SEQUENTIAL_GROUP(text, c, type, group)
  if (c !== tmp) {
    return c
  }

  // SIMULTANEOUS_GROUP
  c = SIMULTANEOUS_GROUP(text, c, type, group)
  if (c !== tmp) {
    return c
  }

  throw new SyntaxError('GROUP: Not a valid group')
}

/**
 * SEQUENTIAL_GROUP<T> = ('[' + PARAMETERS<T> + ']' + REDUNDENT)?
 */
function SEQUENTIAL_GROUP (text, i, type, obj) {
  console.log(`SEQUENTIAL_GROUP<${type.name}>`, i, text.slice(i, i + 5).replace(REGEXP_NAWLINE_G, '\\n'))
  let c = i

  if (REGEXP_LEFT_SQUARE.test(text[c])) {
    // '['
    c++
    obj.$type = 'SEQUENTIAL_GROUP'

    // PARAMETERS<T>
    obj.array = []
    c = PARAMETERS(text, c, type, obj.array)

    // '}'
    if (REGEXP_RIGHT_SQUARE.test(text[c])) {
      c++

      // REDUNDENT
      c = REDUNDENT(text, c)

      return c
    }

    throw new SyntaxError('SEQUENTIAL_GROUP: Missing "]"')
  }

  return c
}

/**
 * SIMULTANEOUS_GROUP<T> = ('{' + PARAMETERS<T> + '}' + REDUNDENT)?
 */
function SIMULTANEOUS_GROUP (text, i, type, obj) {
  console.log(`SIMULTANEOUS_GROUP<${type.name}>`, i, text.slice(i, i + 5).replace(REGEXP_NAWLINE_G, '\\n'))
  let c = i

  if (REGEXP_LEFT_CURLY.test(text[c])) {
    // '{'
    c++
    obj.$type = 'SIMULTANEOUS_GROUP'

    // PARAMETERS<T>
    obj.array = []
    c = PARAMETERS(text, c, type, obj.array)

    // '}'
    if (REGEXP_RIGHT_CURLY.test(text[c])) {
      c++

      // REDUNDENT
      c = REDUNDENT(text, c)

      return c
    }

    throw new SyntaxError('SIMULTANEOUS_GROUP: Missing "}"')
  }

  return c
}

/**
 * INLINE_REDUNDENT = SPACES + COMMENT_WITHOUT_NEWLINE + INLINE_REDUNDENT?
 */
function INLINE_REDUNDENT (text, i) {
  console.log('INLINE_REDUNDENT', i, text.slice(i, i + 5).replace(REGEXP_NAWLINE_G, '\\n'))
  let c = i

  // SPACES
  while (c < text.length && REGEXP_SPACE.test(text[c])) { c++ }

  // COMMENT_WITHOUT_NEWLINE
  if (REGEXP_SLASH.test(text[c])) {
    // '/'
    if (REGEXP_SLASH.test(text[c])) {
      
    }
  }

  return c
}

/**
 * REDUNDENT = SPACES_OR_NEWLINE (+ COMMENT + REDUNDENT)?
 * COMMENT = INLINE_COMMENT | BLOCK_COMMENTS
 */
function REDUNDENT (text, i) {
  console.log('REDUNDENT', i, text.slice(i, i + 5).replace(REGEXP_NAWLINE_G, '\\n'))
  let c = i
  // SPACES_OR_NEWLINE
  while (c < text.length && (REGEXP_SPACE.test(text[c]) || REGEXP_NAWLINE.test(text[c]))) { c++ }

  // (+ COMMENT + REDUNDENT)?
  if (REGEXP_SLASH.test(text[c])) {
    c++
    // COMMENT
    if (REGEXP_SLASH.test(text[c])) {
      // INLINE_COMMENT
      while (c < text.length && !REGEXP_NAWLINE.test(text[c])) { c++ }
    } else if (REGEXP_STAR.test(text[c])) {
      // BLOCK_COMMENTS
      c++
      while (c < text.length && (!REGEXP_STAR.test(text[c]) && !REGEXP_SLASH.test(text[c + 1]))) { c++ }
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
