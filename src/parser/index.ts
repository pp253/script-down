import literal from './literal'
import structure from './structure'

export default {
  parse: parse
}

export function parse (text: string) {
  console.log('parse', 'text length:', text.length)

  // literal parsing
  let lite = literal(text, 0)

  // structure parsing
  let struct = structure(lite)

  console.log(struct)

  return struct
}
