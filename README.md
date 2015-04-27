slide2d
=======
Express vectorial content in JSON using canvas2d directives

## Goal

**slide2d** is a thin wrapper to expose canvas2d API in a JSON DSL.
The goal is to statically describe scalable content.

## The format

```js
{
  "size": [ Number, Number ],
  "background": String,
  "draws": Directive[]
}
```

### `size`

You have to **define your viewport `size`** and the rendering will scale to the canvas size and will also keep your ratio (it will fit the biggest centered rectangle).

### `background`

The full canvas will be filled with a **`background` color**.

### `draws`

Your **`draws` directives** will be used to fill content. These directives allow almost every possible shapes that canvas2d provides and using a simple mapping:

**`draws` directives is an array where each element `E` is either an object or an array:**
- If `E` is an *object*: all values or this object will be set to the canvas context.
- If `E` is an *array*: the first element is the canvas2d context method name and the following elements are arguments to that method.

## Full Example:

```js
var json = {
  "background": "#89B",
  "size": [ 800, 600 ],
  "draws": [
    { "font": "bold 80px sans-serif", "fillStyle": "#fff", "textBaseline": "middle", "textAlign": "center" },
    [ "fillText", "Hello", 400, 250 ],
    { "font": "normal 80px sans-serif", "fillStyle": "#fff", "textBaseline": "middle", "World": "center" },
    [ "fillText", "Example 2", 400, 350 ]
  ]
};

// example of using the json data
var Slide2d = require("slide2d");
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
var slide2d = Slide2d(ctx);
slide2d.render(json);
document.body.appendChild(canvas);
```
