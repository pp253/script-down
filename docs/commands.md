# Commands

## DataType

- `RGB`: *String* '0xrrggbb'
- `XYPercentage`: *Array[x, y]*
- `Coordinate`: *Array[x, y]*

## Flow

### $if(), $elif(), $else, $endif()

Work in progress.

### $goto(hash: String), $hash(hash: String)

Work in progress.

## Stage

### $setStage(name: String, value: Any)

You can set the stage's member variables by `$setStage(name, value)`.

### $setSubtitle(name: String, value: Any)

You can set the subtitle's member variables by `$setStage(name, value)`.

## Character

### $character(name: String, options: Object)

- `name`: *String* The name of the character.
- `options`: *Object* Following are available options.
  - `anchor`: *Number* | *XYPercentage* See [PIXI.Spirite.anchor](http://pixijs.download/dev/docs/PIXI.Sprite.html#anchor).
  - `pivot`: *Coordinate* See [PIXI.Spirite.pivot](http://pixijs.download/dev/docs/PIXI.Sprite.html#pivot)
  - `x`: *Number*
  - `y`: *Number*
  - `textures`: *Object* Key for the texture's name, and value for the texture's image url. `texture` should have a `default` texture.
  
## Game Experience

### $give(name: String, number: Number, limit?: Number)

### $giveone(name: String)

### $take(name: String, number: Number)

### $takeone(name: String)

### $check(name: String)




