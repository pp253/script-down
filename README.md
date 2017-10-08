# 介紹

[範例](./test/測試.sd)

## 基本型別

- String (any charactor that is not a keyword will be trated as string)
- Number (including integer and float)
- Boolean (true or false)
- Array or Sequential Executing List `[]`
- Object or Simultaneously Executing List `{}`

## 基本語法

### Comment

```
// for single line comment
/*
for block comments
*/
```

### Header

```
# Header 1
## Header 2
###### Header 6
```
The space between the first word and '#' is optional.

### Command

```
$command
$command()
$command(argument1, argument2)
```

無參數時可以省略括號。

### Action

對 `charactor` 對象執行 `action` 方法，可以把這個想成是C-style的`charactor->action()`
```
@charactor !action
@charactor !action()
@charactor !action(argument1, argument2)
```

無參數時可以省略括號。

### Sequential and Simultaneously Executing List

循序的，或是同時的執行序列內的指令。
```
Sequential:     [$command, !action]
Simultaneously: {$command, !action}
```

注意：!action只可包含於

## 基本結構

### Execution

```
Execution
```

Execution
- Command: `$command`

### Objective Execution
某個人自己說話。
```
@charactor<<type>?> <Execution?> <Message?>
```

@charactor<<type>?>
- `type`: 角色的型態。像是可以`@someone<laugh>`來表示某位角色笑的樣子。

Execution (Optional)
- Command: `$command`
- Action: `!action`
- Sequentially Executing List: `[$command, !action]`
- Simultaneously Executing List: `{$command, !action}`

Message (Optional)
- String

### Multi-objective Execution
多個人一起說話。
```
{@charactor<<type>?> <Single-Execution?>, @charactor<<type>?> <Single-Execution?>} <All-Execution?> <Message?>
```

在`{}`內的Execution是該角色單獨的，在`{}`外的是所有角色共同執行的，先內而外，且是循序的。

