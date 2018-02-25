
export interface TypeStructure<T> {
  $type: T
}

export interface Options extends Map<string, any> {
}

export interface Breaking {
  $boolean: boolean
}

export interface Name {
  $string: string
}

export interface Title {
  $string: string
}

// GROUP
export enum GROUP_TYPE {
  CURLY_GROUP,
  SQUARE_GROUP
}

export interface Group<T> extends TypeStructure<GROUP_TYPE> {
  $array: Array<T>
}

// FILE
export interface File extends Array<Statement> {
}

// STATEMENT
export enum STATEMENT_TYPE {
  COMMAND,
  ACT,
  HEADER,
  ACTION
}

export interface Statement extends TypeStructure<STATEMENT_TYPE> {
}

export interface Command extends Statement {
  name: string
  argus?: Array<any>
  options?: Options
}

export interface Header extends Statement {
  title?: string
  level: number
  options?: Options
}

export interface Act extends Statement {
  message?: string
  subjectMovementList: Array<SubjectMovement>
  movement?: Movement
}

// ACT

export interface SubjectMovement {
  subject: Subject
  movement: Movement
}

export interface Subject {
  name: string
  variety?: string
}

export interface Movement {
  methods: Array<Command | Action>
  options?: Options
}

export interface Action extends TypeStructure<STATEMENT_TYPE> {
  name: string
  argus?: Array<any>
}

// VALUE
export enum VALUE_TYPE {
  STRING,
  NUMBER,
  BOOLEAN,
  ARRAY,
  OBJECT
}

export interface
