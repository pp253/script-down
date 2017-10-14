let HEADER = {
  $type: 'HEADER',
  level: Number,
  title?: String,
  options?: OPTIONS
}

let COMMAND = {
  $type: 'COMMAND',
  name: String,
  argus?: ARRAY<VALUE>,
  options?: OPTIONS
}

let ACT = {
  $type: 'ACT',
  message: String,
  subjectMovementList: ARRAY<SUBJECT_MOVEMENT>,
  movement?: MOVEMENT
}

let ACTION = {
  $type: 'ACTION',
  name: String,
  argus?: ARRAY<VALUE>,
  options?: OPTIONS
}

let SUBJECT_MOVEMENT = {
  $type: 'SUBJECT_MOVEMENT',
  movement: MOVEMENT,
  subject: SUBJECT
}

let SUBJECT = {
  $type: 'SUBJECT',
  name: String,
  variety?: String
}

let MOVEMENT = {
  $type: 'MOVEMENT',
  methods: [METHOD],
  options?: OPTIONS
}

let METHOD = COMMAND | ACTION

let ARGUMENTS = ARRAY<VALUE>

let ARRAY<T> = {
  $type: 'array',
  $array: [T]
}

let OBJECT<T> = {
  $type: 'object',
  $array: [PAIR<T>]
}

let PAIR<T> = {
  $type: 'PAIR',
  name: String,
  value: T
}

let VALUE = {
  $type: 'boolean' | 'string' | 'number' | 'array' | 'object',
  $boolean?: Boolean,
  $string?: String,
  $number?: Number,
  $array?: [VALUE],
  $object?: [VALUE]
}

let OPTIONS = OBJECT<VALUE>