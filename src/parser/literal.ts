import * as LiteralInterface from './literal-interface'

/**
 * KEYWORD: !, @, #, {}, (), [], <>
 * Prepare for Chinese
 */
const REGEXP_SPACE = /[ ]/
const REGEXP_NEWLINE = /\n/
const REGEXP_NEWLINE_G = /\n/g
const REGEXP_NAME = /[^\\\s\n\t()[\]{}`'+\-*/~!@#$%^&?,.:<>]/
const REGEXP_TITLE = /[^\n{}[\]]/
const REGEXP_MESSAGE = /[^{}[\]]/
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
 * @param {String} text
 * @param {Number} start
 * @returns {Array}
 */
export default function literal (text: string, start: number = 0): LiteralInterface.File {
  return FILE(text, start)
}

/**
 * FILE = REDUNDENT + STATEMENT*
 */
function FILE (text: string, i: number): LiteralInterface.File {
  console.log('FILE', i, text.slice(i, i + 15).replace(REGEXP_NEWLINE_G, '↵'))
  let c = i
  let tmp = c

  let literal = <LiteralInterface.File>[]

  // REDUNDENT
  c = REDUNDENT(text, c)

  // STATEMENT*
  while (c < text.length) {
    let statement = <LiteralInterface.Statement>{}
    c = STATEMENT(text, c, statement)
    if (c === tmp) {
      // No more statements
      break
    }
    literal.push(statement)
    tmp = c
  }

  if (c < text.length) {
    throw new SyntaxError('FILE: Not ending properly.')
  }

  return literal
}

/**
 * STATEMENT = ACT | COMMAND | HEADER + OPTIONS? + REDUNDENT
 */
function STATEMENT (text: string, i: number, statement: LiteralInterface.Statement): number {
  console.log('STATEMENT', i, text.slice(i, i + 15).replace(REGEXP_NEWLINE_G, '↵'))
  let c = i
  let tmp = c

  // ACT
  c = ACT(text, c, statement)
  if (c !== tmp) {
    // REDUNDENT
    c = REDUNDENT(text, c)
    return c
  }

  // COMMAND
  c = COMMAND(text, c, statement)
  if (c !== tmp) {
    // OPTIONS?
    let opt = {}
    c = OPTIONS(text, c, opt)
    ;(<LiteralInterface.Command>statement).options = opt

    // REDUNDENT
    c = REDUNDENT(text, c)
    return c
  }

  // HEADER
  c = HEADER(text, c, statement)
  if (c !== tmp) {
    // OPTIONS?
    let opt = {}
    c = OPTIONS(text, c, opt)
    ;(<LiteralInterface.Header>statement).options = opt

    // REDUNDENT
    c = REDUNDENT(text, c)
    return c
  }

  throw new SyntaxError('STATEMENT: No such statement.')
}

/**
 * COMMAND = ('$' + NAME + INLINE_REDUNDENT + ARGUMENTS?)?
 */
function COMMAND (text: string, i: number, command: LiteralInterface.Command): number {
  console.log('COMMAND', i, text.slice(i, i + 15).replace(REGEXP_NEWLINE_G, '↵'))
  let c = i

  if (REGEXP_DOLLAR.test(text[c])) {
    // '$'
    c++

    // NAME
    let name = <LiteralInterface.Name>{}
    c = NAME(text, c, name)

    // INLINE_REDUNDENT
    let breaking = <LiteralInterface.Breaking>{}
    c = INLINE_REDUNDENT(text, c, breaking)

    command.$type = LiteralInterface.STATEMENT_TYPE.COMMAND
    command.name = name.$string

    if (!breaking.$boolean) {
      // ARGUMENTS?
      let argus = []
      c = ARGUMENTS(text, c, argus)
      command.argus = argus
    }
  }

  return c
}

/**
 * HEADER = ('#'+ + INLINE_REDUNDENT + TITLE?)?
 * @param {Object} header
 */
function HEADER (text: string, i: number, header: LiteralInterface.Header): number {
  console.log('HEADER', i, text.slice(i, i + 15).replace(REGEXP_NEWLINE_G, '↵'))
  let c = i

  if (REGEXP_HASH.test(text[c])) {
    // '#'*
    c++
    let level = 1
    for (; c < text.length && REGEXP_HASH.test(text[c]); c++) {
      level++
    }

    // INLINE_REDUNDENT
    let breaking = <LiteralInterface.Breaking>{}
    c = INLINE_REDUNDENT(text, c, breaking)

    header.$type = LiteralInterface.STATEMENT_TYPE.COMMAND
    header.level = level

    if (!breaking.$boolean) {
      // TITLE
      let title = <LiteralInterface.Title>{}
      c = TITLE(text, c, title)
      header.title = title.$string
    }
  }

  return c
}

/**
 * ACT = (((CURLY_GROUP<SUBJECT_MOVEMENT> + MOVEMENT?) | SUBJECT_MOVEMENT) + MESSAGE:TITLE?)?
 * @param {Object} act
 */
function ACT (text: string, i: number, act: LiteralInterface.Act): number {
  console.log('ACT', i, text.slice(i, i + 15).replace(REGEXP_NEWLINE_G, '↵'))
  let c = i
  let tmp = c

  let subjectMovementList = <LiteralInterface.Group<LiteralInterface.SubjectMovement>>{}
  subjectMovementList.$type = LiteralInterface.GROUP_TYPE.CURLY_GROUP

  // (CURLY_GROUP<SUBJECT_MOVEMENT> + MOVEMENT?)
  c = CURLY_GROUP(text, c, SUBJECT_MOVEMENT, subjectMovementList)
  if (c !== tmp) {
    // MOVEMENT?
    let movement = {}
    c = MOVEMENT(text, c, movement)
    act.movement = movement
  } else {
    // SUBJECT_MOVEMENT
    let subjectMovement = {}
    c = SUBJECT_MOVEMENT(text, c, subjectMovement)
    subjectMovementList.$array.push(subjectMovement)

    if (c === tmp) {
      // Not a SUBJECT_MOVEMENT; therefore, not an ACT
      return c
    }
  }

  // MESSAGE:TITLE?
  let message = {}
  c = TITLE(text, c, message)

  act.$type = 'ACT'
  act.subjectMovementList = subjectMovementList
  act.message = message.$string

  return c
}

/**
 * SUBJECT_MOVEMENT = (SUBJECT + MOVEMENT?)?
 * @param {Object} subjectMovement
 */
function SUBJECT_MOVEMENT (text: string, i: number, subjectMovement) {
  console.log('SUBJECT_MOVEMENT', i, text.slice(i, i + 15).replace(REGEXP_NEWLINE_G, '↵'))
  let c = i
  let tmp = c

  // SUBJECT
  let subject = {}
  c = SUBJECT(text, c, subject)

  if (tmp !== c) {
    // MOVEMENT?
    let movement = []
    c = MOVEMENT(text, c, movement)

    subjectMovement.$type = 'SUBJECT_MOVEMENT'
    subjectMovement.subject = subject
    subjectMovement.movement = movement
  }

  return c
}

/**
 * SUBJECT = ('@' + NAME + INLINE_REDUNDENT + VARIETY?)?
 * @param {Object} subject
 */
function SUBJECT (text: string, i: number, subject) {
  console.log('SUBJECT', i, text.slice(i, i + 15).replace(REGEXP_NEWLINE_G, '↵'))
  let c = i

  if (REGEXP_AT.test(text[c])) {
    // '@'
    c++

    // NAME
    let name = {}
    c = NAME(text, c, name)

    // INLINE_REDUNDENT
    let breaking = {}
    c = INLINE_REDUNDENT(text, c, breaking)

    subject.$type = 'SUBJECT'
    subject.name = name.$string

    if (!breaking.$boolean) {
      // VARIETY?
      let variety = {}
      c = VARIETY(text, c, variety)
      subject.variety = variety.$string
    }
  }

  return c
}

/**
 * VARIETY = ('[' + INLINE_REDUNDENT + NAME + INLINE_REDUNDENT + ']' + INLINE_REDUNDENT)?
 * @param {Object} variety
 */
function VARIETY (text: string, i: number, variety) {
  console.log('VARIETY', i, text.slice(i, i + 15).replace(REGEXP_NEWLINE_G, '↵'))
  let c = i

  if (REGEXP_LEFT_SQUARE.test(text[c])) {
    // '['
    c++

    // INLINE_REDUNDENT
    let breaking = {}
    c = INLINE_REDUNDENT(text, c, breaking)

    if (!breaking.$boolean) {
      // NAME
      c = NAME(text, c, variety)

      // INLINE_REDUNDENT
      c = INLINE_REDUNDENT(text, c, breaking)

      if (!breaking.$boolean) {
        // ']'
        if (!REGEXP_RIGHT_SQUARE.test(text[c])) {
          throw new SyntaxError('VARIETY: Missing ">"')
        }
        c++

        // INLINE_REDUNDENT
        c = INLINE_REDUNDENT(text, c, breaking)
      }
    }
  }

  return c
}

/**
 * MOVEMENT = (METHOD* + OPTIONS?)?
 * @param {Object} movement
 */
function MOVEMENT (text: string, i: number, movement) {
  console.log('MOVEMENT', i, text.slice(i, i + 15).replace(REGEXP_NEWLINE_G, '↵'))
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

  movement.$type = 'MOVEMENT'
  movement.methods = methods
  movement.options = opt

  return c
}

/**
 * METHOD = (ACTION | COMMAND)?
 */
function METHOD (text: string, i: number, method) {
  console.log('METHOD', i, text.slice(i, i + 15).replace(REGEXP_NEWLINE_G, '↵'))
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
 * ACTION = ('!' + NAME + INLINE_REDUNDENT + ARGUMENTS?)?
 * @param {Object} action
 */
function ACTION (text: string, i: number, action) {
  console.log('ACTION', i, text.slice(i, i + 15).replace(REGEXP_NEWLINE_G, '↵'))
  let c = i

  if (REGEXP_EXCLAMATION.test(text[c])) {
    // '!'
    c++

    // NAME
    let name = {}
    c = NAME(text, c, name)

    // INLINE_REDUNDENT
    let breaking = {}
    c = INLINE_REDUNDENT(text, c, breaking)

    action.$type = 'ACTION'
    action.name = name.$string

    if (!breaking.$boolean) {
      // ARGUMENTS?
      let argus = []
      c = ARGUMENTS(text, c, argus)
      action.argus = argus
    }
  }

  return c
}

/**
 * ARGUMENTS = ('(' + PARAMETERS<VALUE> + ')' + INLINE_REDUNDENT)?
 */
function ARGUMENTS (text: string, i: number, arr) {
  console.log('ARGUMENTS', i, text.slice(i, i + 15).replace(REGEXP_NEWLINE_G, '↵'))
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

    // INLINE_REDUNDENT
    c = INLINE_REDUNDENT(text, c)

    return c
  }

  return c
}

/**
 * PARAMETERS<T> = RUNDUNDENT + T + RUNDUNDENT + (',' + PARAMETERS<T>)?
 * @param {Object | Array} obj
 */
function PARAMETERS (text: string, i: number, type, arr) {
  console.log(`PARAMETERS<${type.name}>`, i, text.slice(i, i + 15).replace(REGEXP_NEWLINE_G, '↵'))
  let c = i

  // RUNDUNDENT
  c = REDUNDENT(text, c)

  // VALUE
  let value = {}
  c = type(text, c, value)
  arr.push(value)

  // RUNDUNDENT
  c = REDUNDENT(text, c)

  // (',' + PARAMETERS)?
  if (REGEXP_COMMA.test(text[c])) {
    // PARAMETERS
    c++
    c = PARAMETERS(text, c, type, arr)
  }
  return c
}

/**
 * VALUE = NUMBER | BOOLEAN  | STRING | NAME| ARRAY:SQUARE_GROUP<VALUE> | OBJECT:CURLY_GROUP<PAIR>
 * @param {Object} value
 */
function VALUE (text: string, i: number, value) {
  console.log('VALUE', i, text.slice(i, i + 15).replace(REGEXP_NEWLINE_G, '↵'))
  let c = i
  let tmp = c

  // NUMBER
  c = NUMBER(text, c, value)
  if (c !== tmp) {
    value.$type = 'number'
    return c
  }

  // BOOLEAN
  c = BOOLEAN(text, c, value)
  if (c !== tmp) {
    value.$type = 'boolean'
    return c
  }

  // STRING
  c = STRING(text, c, value)
  if (c !== tmp) {
    value.$type = 'string'
    return c
  }

  // ARRAY:SQUARE_GROUP<VALUE>
  c = SQUARE_GROUP(text, c, VALUE, value)
  if (c !== tmp) {
    value.$type = 'array'
    return c
  }

  // OBJECT:CURLY_GROUP<PAIR>
  c = CURLY_GROUP(text, c, PAIR, value)
  if (c !== tmp) {
    value.$type = 'object'
    return c
  }

  // NAME
  c = NAME(text, c, value)
  if (c !== tmp) {
    value.$type = 'string'
    return c
  }

  return c
}

/**
 * STRING = ("'" + ... + "'" | '"' + ... + '"')
 */
function STRING (text: string, i: number, value) {
  console.log('STRING', i, text.slice(i, i + 15).replace(REGEXP_NEWLINE_G, '↵'))
  let c = i
  if (REGEXP_SINGLE_QUOTES.test(text[c]) || REGEXP_DOUBLE_QUOTES.test(text[c])) {
    // ("'" + ... + "'" | '"' + ... + '"')
    let str = ''
    let target = text[c]
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
function NUMBER (text: string, i: number, value) {
  console.log('NUMBER', i, text.slice(i, i + 15).replace(REGEXP_NEWLINE_G, '↵'))
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
 * BOOLEAN = ('true' | 'false')?
 */
function BOOLEAN (text: string, i: number, value) {
  console.log('BOOLEAN', i, text.slice(i, i + 15).replace(REGEXP_NEWLINE_G, '↵'))
  let c = i

  if (text.slice(c, c + 4) === 'true') {
    value.$boolean = true
    c += 4
  } else if (text.slice(c, c + 5) === 'false') {
    value.$boolean = false
    c += 5
  }

  return c
}

/**
 * OPTIONS = CURLY_GROUP<PAIR>
 */
function OPTIONS (text: string, i: number, opt) {
  console.log('OPTIONS', i, text.slice(i, i + 15).replace(REGEXP_NEWLINE_G, '↵'))
  let c = i

  // CURLY_GROUP<PAIR>
  c = CURLY_GROUP(text, c, PAIR, opt)

  return c
}

/**
 * PAIR = NAME + REDUNDENT + ':' + REDUNDENT + VALUE
 */
function PAIR (text: string, i: number, pair) {
  console.log('PAIR', i, text.slice(i, i + 15).replace(REGEXP_NEWLINE_G, '↵'))
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

  pair.$type = 'PAIR'
  pair.name = name.$string
  pair.value = value

  return c
}

/**
 * NAME = REGEXP_NAME*
 * @param {Object} name, add on name.$string
 */
function NAME (text: string, i: number, name) {
  console.log('NAME', i, text.slice(i, i + 15).replace(REGEXP_NEWLINE_G, '↵'))
  let c = i
  let str = ''

  // REGEXP_NAME*
  for (; c < text.length && REGEXP_NAME.test(text[c]); c++) {
    str += text[c]
  }
  name.$string = str

  return c
}

/**
 * TITLE = REGEXP_TITLE* + INLINE_REDUNDENT
 */
function TITLE (text: string, i: number, title) {
  console.log('TITLE', i, text.slice(i, i + 15).replace(REGEXP_NEWLINE_G, '↵'))
  let c = i
  let str = ''

  // REGEXP_TITLE*
  for (; c < text.length && REGEXP_TITLE.test(text[c]); c++) {
    str += text[c]
  }
  title.$string = str

  // INLINE_REDUNDENT
  c = INLINE_REDUNDENT(text, c)

  return c
}

/**
 * GROUP<T> = SQUARE_GROUP<T> | CURLY_GROUP<T>
 */
function GROUP (text: string, i: number, type, group) {
  console.log(`GROUP<${type.name}>`, i, text.slice(i, i + 15).replace(REGEXP_NEWLINE_G, '↵'))
  let c = i
  let tmp = c

  // SQUARE_GROUP
  c = SQUARE_GROUP(text, c, type, group)
  if (c !== tmp) {
    return c
  }

  // CURLY_GROUP
  c = CURLY_GROUP(text, c, type, group)
  if (c !== tmp) {
    return c
  }

  throw new SyntaxError('GROUP: Not a valid group')
}

/**
 * SQUARE_GROUP<T> = ('[' + PARAMETERS<T> + ']' + INLINE_REDUNDENT)?
 */
function SQUARE_GROUP (text: string, i: number, type, obj) {
  console.log(`SQUARE_GROUP<${type.name}>`, i, text.slice(i, i + 15).replace(REGEXP_NEWLINE_G, '↵'))
  let c = i

  if (REGEXP_LEFT_SQUARE.test(text[c])) {
    // '['
    c++
    obj.$type = 'SQUARE_GROUP'

    // PARAMETERS<T>
    obj.array = []
    c = PARAMETERS(text, c, type, obj.array)

    // '}'
    if (REGEXP_RIGHT_SQUARE.test(text[c])) {
      c++

      // INLINE_REDUNDENT
      c = INLINE_REDUNDENT(text, c)

      return c
    }

    throw new SyntaxError('SQUARE_GROUP: Missing "]"')
  }

  return c
}

/**
 * CURLY_GROUP<T> = ('{' + PARAMETERS<T> + '}' + INLINE_REDUNDENT)?
 */
function CURLY_GROUP (text: string, i: number, type, obj) {
  console.log(`CURLY_GROUP<${type.name}>`, i, text.slice(i, i + 15).replace(REGEXP_NEWLINE_G, '↵'))
  let c = i

  if (REGEXP_LEFT_CURLY.test(text[c])) {
    // '{'
    c++
    obj.$type = 'CURLY_GROUP'

    // PARAMETERS<T>
    obj.$array = []
    c = PARAMETERS(text, c, type, obj.$array)

    // '}'
    if (REGEXP_RIGHT_CURLY.test(text[c])) {
      c++

      // INLINE_REDUNDENT
      c = INLINE_REDUNDENT(text, c)

      return c
    }

    throw new SyntaxError('CURLY_GROUP: Missing "}"')
  }

  return c
}

/**
 * INLINE_REDUNDENT = SPACES + COMMENT_WITHOUT_NEWLINE + INLINE_REDUNDENT?
 * @param {Object} breaking breaking.$boolean = true 代表有換行
 */
function INLINE_REDUNDENT (text: string, i: number, breaking) {
  console.log('INLINE_REDUNDENT', i, text.slice(i, i + 15).replace(REGEXP_NEWLINE_G, '↵'))
  let c = i
  if (!breaking) {
    breaking = {}
  }
  breaking.$boolean = false

  // SPACES
  while (c < text.length && REGEXP_SPACE.test(text[c])) { c++ }

  // COMMENT_WITHOUT_NEWLINE
  if (REGEXP_SLASH.test(text[c])) {
    // '/'
    c++
    if (REGEXP_SLASH.test(text[c])) {
      // '/', double '/', INLINE_COMMENT
      c++
      while (c < text.length && !REGEXP_NEWLINE.test(text[c])) { c++ }

      breaking.$boolean = true
    } else if (REGEXP_STAR.test(text[c])) {
      // '*', '/*', BLOCK_COMMENTS
      c++

      for (;c < text.length && (!REGEXP_STAR.test(text[c]) && !REGEXP_SLASH.test(text[c + 1])); c++) {
        if (REGEXP_NEWLINE.test(text[c])) {
          breaking.$boolean = true
        }
      }

      c += 2

      if (breaking.$boolean === false) {
        c = INLINE_REDUNDENT(text, c, breaking)
      }
    } else {
      // wrong
      throw new SyntaxError('INLINE_REDUNDENT: Expected "*" or "/"')
    }
  }

  return c
}

/**
 * REDUNDENT = SPACES_OR_NEWLINE (+ COMMENT + REDUNDENT)?
 * COMMENT = INLINE_COMMENT | BLOCK_COMMENTS
 */
function REDUNDENT (text: string, i: number) {
  console.log('REDUNDENT', i, text.slice(i, i + 15).replace(REGEXP_NEWLINE_G, '↵'))
  let c = i
  // SPACES_OR_NEWLINE
  while (c < text.length && (REGEXP_SPACE.test(text[c]) || REGEXP_NEWLINE.test(text[c]))) { c++ }

  // (+ COMMENT + REDUNDENT)?
  if (REGEXP_SLASH.test(text[c])) {
    c++
    // COMMENT
    if (REGEXP_SLASH.test(text[c])) {
      // INLINE_COMMENT
      while (c < text.length && !REGEXP_NEWLINE.test(text[c])) { c++ }
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
