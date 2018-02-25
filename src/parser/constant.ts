import {Options} from '../constant'

// Type
export interface Variables extends Map<string, any> {
}

export interface Scene {

}

export interface Character {

}

export interface Subject {
  name: string
  variety?: string
}

export interface Movement {
  methods?: Array<Command | Action>
  options?: Options
}

export interface SubjectMovement {
  subject: Subject
  movement: Movement
}

// TypeStructure
export enum STRUCTURE_TYPE {
  SCRIPT,
  COMMAND,
  ACTION,
  ACT,
  FLOW_CONTROL_IF,
  FLOW_CONTROL_LOOP,
  FLOW_CONTROL_SELECT,
  FLOW_CONTROL_CONTINUE,
  FLOW_CONTROL_BREAK,
  SECTION
}

interface TypeStructure {
  readonly $type: STRUCTURE_TYPE
}

export interface Command extends TypeStructure {
  name: string
  argus: Array<any>
  options: Options
}

export interface Action extends TypeStructure {
  name: string
  argus: Array<any>
}

export interface Act extends TypeStructure {
  message: string
  subjectMovementList: Array<SubjectMovement>
  movement?: SubjectMovement
}


export interface FlowControl extends TypeStructure {
  // TODO
}

// ParsedStructure
interface Structure extends TypeStructure {
  options?: Options
  variables: Variables
  title?: string
  level?: number
}

export interface Script extends Array<Section>, Structure {
  author?: string
  description?: string
  version?: string
  user: Variables
  static: Variables
  scenes: Map<string, Scene>
  characters: Map<string, Character>
}

export interface Section extends Array<Command | Act | FlowControl | Section>,  Structure {
  scene: Scene
}
