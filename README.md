# ScriptDown

ScriptDown 讓你的劇本＝你的網頁冒險遊戲([AVG](https://zh.wikipedia.org/zh-tw/%E5%86%92%E9%99%A9%E6%B8%B8%E6%88%8F))。

[ScriptDown範例編輯器](https://pp253.github.io/script-down/test/editor.html) | [DOCS](./docs/index.md) | DEMO (Wrok in process)

## 基本語法

### Message

如何讓你的人物說話？在你的劇本中寫入以下文字。

```txt
@學生 二餐三樓讚！
```

就可以看到，

![@學生 二餐三樓讚！](./docs/demo1.PNG)

想要多個人一起說話嗎？

```txt
{@男主角, @女主角} 我討厭你！
```

![{@男主角, @女主角} 我討厭你！](./docs/demo2.PNG)

### Action

你也可以添加Action，讓你的角色出場、移動位置或是做效果。但在添加Action前，必須先定義學生是什麼，

```
$character(學生)
```

然後就可以在後面加入你的Action，

```
@學生 !appear // 出現
@學生 !shake // 搖身體
@學生 !disappear 我消失了 // 邊退場邊說話
@學生 !appear !move(20, 30) // 多個動作
{@男主角, @女主角} !appear 我們一起說話 // 多人同動作同對話
{@男主角 !appear, @女主角} 我們一起說話 // 同時說話，但個別執行動作
```

悄悄話：可以把這個想成是C-style的`charactor->action()`，無參數時可以省略括號。

[了解更多Action](./docs/actions.md)

### Command

剛剛定義學生的方法 `$character(學生)` 其實是一種Command，你還可以用Command做到更多的事情，不論是定義舞台背景顏色，還是撥放音樂都可以用Command完成。

```
$command
$character(學生)
$setStage(backgroundColor, "0x0")
```

悄悄話：command是對全域的函數，無參數時可以省略括號。

[了解更多Command](./docs/commands.md)

### Header

你還可以為你的劇本添加各種層級的標題。

```
# 標題一
## 標題二
###其實井字號和標題中間的空格可以不用打
```

### Comment

如果你的劇本越寫越大，你可能會需要一些註解來幫助你，ScriptDown也有提供你進行註解的方法。

```
// 單行註解
/*
  區塊註解　據透：男主角是兇手
*/
```

放心，這些註解都不會出現在你的遊戲中。

### Options

Options 可以讓你的劇本變得更多樣，像是能夠延遲對話的出現，或是增加轉場效果。

```
# Header 1 {delay: 3000}
@character !action {delay: 3000} my text...
$command() {delay: 3000}
```

悄悄話：Options 的結構和 JavaScript 中的 `Object` 大致相同，唯一不同處為做為鍵值的字串，在不包含不允許的字符(`/[^\\\s\n\t()[\]{}'+\-*/~!@#$%^&?,.:<>]`)下，可以不用以`"`或`'`括住。

[了解更多Options](./docs/options.md)

# Dependency

- [PixiJS](http://www.pixijs.com/)
- [PixiJS Filters](https://github.com/pixijs/pixi-filters)
- [pixi-multistyle-text](https://github.com/tleunen/pixi-multistyle-text)
- [Lodash](https://lodash.com/)
- [Cubic Bézier solver](https://www.npmjs.com/package/cubic-bezier)

# Special Thanks

Inspired by [BASS遊戲製作平台](http://bassavg.com/games.php)

# License

ScriptDown is published under [Apache-2.0](./LICENSE).
