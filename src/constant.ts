import * as PIXI from 'pixi.js'
import {ColorChangeableGraphic} from './utils'
import MultiStyleText, {TextStyleSet} from 'pixi-multistyle-text'

export interface Options {
  [propName: string]: any
}

export interface Textures extends Map<string, string> {
  default: string
}

/**
 * ScriptDown
 */
export const ScriptDownDefaultOptions: PIXI.ApplicationOptions = {
  width: 800,
  height: 600,
  backgroundColor: 0x0
}

/**
 * ViewManager
 */
export interface ViewManagerOptions {

}

/**
 * Scene
 */
export interface SceneOptions {
  height?: number
  width?: number
  backgroundColor?: number
  characters?: Map<string, Character>
}

export const SceneDefaultOptions = {
  height: 600,
  width: 800,
  backgroundColor: 0x90caf9,
  characters: {}
}

/**
 * Subtitle
 */
export interface SubtitleOptions {
  height?: number
  width?: number
  backgroundColor?: number
  paddingTop?: number
  paddingRight?: number
  paddingBottom?: number
  paddingLeft?: number
  content?: TextStyleSet
}

export const SubtitleDefaultOptions = {
  height: 180,
  width: 800,
  backgroundColor: 0x009688,
  paddingTop: 30,
  paddingRight: 30,
  paddingBottom: 30,
  paddingLeft: 30,
  content: {
    'default': {
      fontFamily: 'Arial',
      fontSize: '20px',
      fontWeight: 100,
      fill: '#cccccc',
      align: 'left',
      wordWrap: true,
      wordWrapWidth: 740
    },
    'b': {
      fontWeight: 'bold'
    },
    'i': {
      fontStyle: 'italic'
    }
  }
}

/**
 * Character
 */
export interface Character extends PIXI.Sprite {
}

export interface CharacterOptions {
  textures?: Textures
  x?: number
  y?: number
  rotation?: number
  scale?: number
  scaleX?: number
  scaleY?: number
  anchor?: number
  anchorX?: number
  anchorY?: number
  pivot?: number
  pivotX?: number
  pivotY?: number
}

export const CharacterDefaultOptions: CharacterOptions = {
  textures: {
    default: './img/bunny.png'
  },
  x: 200,
  y: 200,
  rotation: 0,
  scale: 1,
  scaleX: 1,
  scaleY: 1,
  anchor: 0.5,
  anchorX: 0.5,
  anchorY: 0.5,
  pivot: 0.5,
  pivotX: 0.5,
  pivotY: 0.5
}
