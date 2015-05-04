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
    [ "arc", 280, 200, 20, 0, 7 ],
    [ "fill" ],
    { "font": "bold 80px sans-serif", "fillStyle": "#000", "textBaseline": "middle", "textAlign": "center" },
    [ "fillText", "Hello World", 400, 100 ],
    { "font": "normal 80px sans-serif", "fillStyle": "#f00", "textBaseline": "middle", "textAlign": "center" },
    [ "fillText", "Red", 400, 200 ],
    { "font": "italic 40px sans-serif", "fillStyle": "#aaa", "textBaseline": "middle", "textAlign": "center" },
    [ "fillText", "does support\nmulti-line texts!\n\nusing the \\n character.", 400, 300, 48]
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



window.slide2d = slide2d; // for debug purpose
