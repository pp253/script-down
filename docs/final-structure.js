let FILE = [HEADER, COMMAND, ACT]

let OPTIONS = {}

let METHOD = COMMAND || ACTION

let VALUE = String || Number || Boolean || Object || Array

let HEADER = {
  $type: 'HEADER',
  level: Number,
  title?: String,
  options?: OPTIONS
}

let COMMAND = {
  $type: 'COMMAND',
  name: String,
  argus?: [VALUE],
  options?: OPTIONS
}

let ACTION = {
  $type: 'ACTION',
  name: String,
  argus?: [VALUE]
}

let ACT = {
  $type: 'ACT',
  message: String,
  subjectMovementList: [SUBJECT_MOVEMENT],
  movement?: MOVEMENT
}

let SUBJECT_MOVEMENT = {
  movement: MOVEMENT,
  subject: SUBJECT
}

let SUBJECT = {
  name: String,
  variety?: String
}

let MOVEMENT = {
  methods: [METHOD],
  options?: OPTIONS
}
