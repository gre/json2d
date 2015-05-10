slide2d
=======
Express vectorial content in JSON using canvas2d directives

## Goal

**slide2d** is a thin wrapper to expose canvas2d API in a JSON DSL.
The goal is to statically describe scalable content.

## The API

```
var Slide2d = require("slide2d");
var canvas = ...;
var ctx = canvas.getContext("2d");
var slide2d = Slide2d(ctx);

// Now call the render method:
slide2d.render(data);
```

## The `data` format

```js
{
  "size": [ Number, Number ],
  "background": String,
  "draws": Directive[]
}
```

> where `Directive` is either:
- an `Object` defining all styles to set
- an `Array` defining the draw atomic operation: the method to call followed by parameters
- a sub `Directive[]`

### `size`

You have to **define your viewport `size`** and the rendering will scale to the canvas size and will also keep your ratio (it will fit the biggest centered rectangle).

### `background`

The full canvas will be filled with a **`background` color**.

### `draws`

Your **`draws` directives** will be used to fill and draw content. These directives are **direct mapping from [Canvas 2D context API](http://www.w3.org/TR/2dcontext/)**. Almost every possible shapes that canvas2d provides are supported with following DSL:

**`draws` directives is an array where each element `E` is one of following:**
- If `E` is an *object*, this object defines all styles to set: all values or this object will be set to the canvas context.
- If `E` is an *array*, this defines an atomic drawing operation: the first element is the canvas2d context method name and the following elements are arguments to that method.
- If `E` is an *array* and `E[0]` is also an array, E is a sub array of `draws` directives. It defines a group of operations. Such group is scoped: `ctx.save()` will be called at the start and `ctx.restore()` will be called at the end.

All draws that occurs will be scaled relatively to the `size` you have defined. That way, we can define scalable (vectorial) content.

## Extension to the Canvas 2D API

There are some exceptions where the `draws` get extended.

### drawImage

`slide2d` supports images drawing with `drawImage` but to define the image you can pass the URL (or a data64 URL) in the first argument.

### Multi-line texts support

`slide2d` supports multi-line texts using the `\n` character.
To do so, every texts will be split on `\n` and result of multiple texts draws.
Note that you still have to define where the new lines are.

In that context, you
**MUST provide a 4th parameter** if you want that multi-line feature: **the lineHeight in pixels**.

> Note: the `maxWidth` that allows the [canvas2d specification](http://www.w3.org/TR/2dcontext/#drawing-text-to-the-canvas) is not supported by slide2d.

## Full Example:

```js
var json = {
  "background": "#efd",
  "size": [ 800, 600 ],
  "draws": [
    [ "drawImage", "http://i.imgur.com/N8a9CkZ.jpg", 530, 700, 800, 200, 0, 400, 800, 200 ],
    { "font": "italic bold 20px monospace", "fillStyle": "#09f", "textBaseline": "top", "textAlign": "right" },
    [ "fillText", "some texts...\nLorem ipsum dolor sit amet,\n consectetur adipiscing elit,\n sed do eiusmod tempor incididunt ut labore\net dolore magna aliqua.", 780, 10, 20 ],
    { "font": "italic 40px sans-serif", "fillStyle": "#099", "textBaseline": "middle", "textAlign": "center" },
    [ "fillText", "does support\nmulti-line texts!\n\nusing the '\\n' character.\n\nand also supports images :)", 400, 200, 48],
    [ "beginPath" ],
    { "fillStyle": "#f00" },
    [ "arc", 40, 40, 20, 0, 7 ],
    [ "fill" ],
    [
      [ "beginPath" ],
      { "fillStyle": "#f0f", "strokeStyle": "#909", "lineWidth": 4 },
      [ "moveTo", 100, 60 ],
      [ "lineTo", 80, 20 ],
      [ "lineTo", 120, 20 ],
      [ "fill" ],
      [ "closePath" ],
      [ "stroke" ]
    ],
    [
      [ "rotate", -1.5708 ],
      { "font": "normal 60px sans-serif", "fillStyle": "#f00", "textBaseline": "top", "textAlign": "right" },
      [ "fillText", "Some shapes", -80, 0 ]
    ],
    [
      [ "beginPath" ],
      { "strokeStyle": "rgba(0,0,0,0.2)", "lineWidth": 4 },
      [ "rect", 2, 2, 796, 596 ],
      [ "stroke" ]
    ]
  ]
};

function Canvas (w, h, r) {
  var canvas = document.createElement("canvas");
  canvas.width = r * w;
  canvas.height = r * h;
  canvas.style.width = w + "px";
  canvas.style.height = h + "px";
  return canvas;
}

var Slide2d = require("slide2d");
var canvas = Canvas(600, 300, window.devicePixelRatio || 1);
var ctx = canvas.getContext("2d");
var slide2d = Slide2d(ctx);
slide2d.render(json);
document.body.appendChild(canvas);
```

![](http://i.imgur.com/hAPUzTb.png)

Note in the example how the content is trying to take the biggest possible rectangle in the canvas viewport. For the sake of this example, we have drawn the biggest possible rectangle with a red stroke, but usually you just fill text and shapes in the middle to have a seamless rendering.

## `render(data, **visitor)**`

The render method allows a second parameter:
a visitor function called after each rendering steps.

It is called in **post order** for each draw *Directive*.

That function is called with 2 parameters:
- the `path`: an array of indexes of the tree path of the current draw.
- the `draw` object.

This function is used by `slide2d-editor` implementation.

## Used by...

- [diaporama](https://github.com/gre/diaporama/)
