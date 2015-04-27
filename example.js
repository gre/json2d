var json = {
  "background": "#ddd",
  "size": [ 800, 600 ],
  "draws": [
    [ "beginPath" ],
    { "fillStyle": "#eee", "strokeStyle": "#f00" },
    [ "rect", 1, 1, 798, 598 ],
    [ "stroke" ],
    [ "beginPath" ],
    { "fillStyle": "#f00" },
    [ "arc", 280, 350, 20, 0, 7 ],
    [ "fill" ],
    { "font": "bold 80px sans-serif", "fillStyle": "#000", "textBaseline": "middle", "textAlign": "center" },
    [ "fillText", "Hello World", 400, 250 ],
    { "font": "normal 80px sans-serif", "fillStyle": "#f00", "textBaseline": "middle", "textAlign": "center" },
    [ "fillText", "Red", 400, 350 ]
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

var Slide2d = require(".");
var canvas = Canvas(600, 300, window.devicePixelRatio || 1);
var ctx = canvas.getContext("2d");
var slide2d = Slide2d(ctx);
slide2d.render(json);
document.body.appendChild(canvas);
