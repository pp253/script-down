# Options

## DataType

# Flow Control

- `pause`: *Boolean* After processing the statement, pause the game until `next()` triggered. Default value for `ACT` and `HEADER` is `true`, for `COMMAND` is `false`.
- `dalay`: *Number* Delay the process of the statement in millisecond. Default value is `0`.
- `proceed`: *Boolean* If the game pauses, the game will not respond to any triggered `next()` until all of the tasks have been done. `proceed` can keep the game responding to the `next()`. Default value is `false`.
- `postpone`: *Number* Postpone the reaction to the `next()` in millisecond. Default value is `0`.
- `autostep`: *Boolean* Automatically trigger `next()` after `postpone`. Default value is `false`.

# Action

## Transition

- `duration`: *Number* Set the duration of the transition in millisecond. Default value is `0`.
- `transition`: *String* Set the bezier function for the transition. Avaliable timing function: [easings](http://easings.net/zh-tw#). Default value is `linear`.

Avaliable for transition:
- `!move`
- `!moveTo`
- `!rotate`
- `!rotateByDegree`
- `!changeScale` Wrok in Process
- `!changeSize` Wrok in Process
