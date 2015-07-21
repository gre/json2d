var json = {
  "background": "#000",
  "size": [ 800, 600 ],
  "draws": [
    ["drawImage", "http://i.imgur.com/K0iotM4.jpg", 0, 0, 400, 300],
    ["drawImage", "http://i.imgur.com/rGQ1GBo.jpg", 400, 0, 400, 300],
    ["drawImage", "http://i.imgur.com/3Xkv00y.jpg", 0, 300, 400, 300],
    ["drawImage", "http://i.imgur.com/gKLcnIT.jpg", 400, 300, 400, 300]
  ]
};

create().render(json);

document.body.appendChild(document.createElement("br"));

var asyncSlide2d = create(waitAllImages(json, function () {
  asyncSlide2d.render(json);
}));

///////////////////////////////////////////////

function Canvas (w, h, r) {
  var canvas = document.createElement("canvas");
  canvas.width = r * w;
  canvas.height = r * h;
  canvas.style.width = w + "px";
  canvas.style.height = h + "px";
  return canvas;
}

function forEachImage (draws, cb) {
  draws.forEach(function (op) {
    if (op instanceof Array) {
      if (typeof op[0] === "object") {
        forEachImage(op, cb);
      }
      else if (op[0]==="drawImage") {
        cb(op[1]);
      }
    }
  });
}

function waitAllImages (json, done) {
  var imgsCache = {};
  var loaded = 0;
  var count = 0;
  forEachImage(json.draws, function (src) {
    ++count;
    var img = new window.Image();
    img.onload = function () {
      if(++loaded === count)
        done();
    };
    img.src = src;
    imgsCache[src] = img;
  });
  if (count === 0) setTimeout(done, 0);
  return function (url) {
    return imgsCache[url];
  };
}

function create (resolveImage) {
  var Slide2d = require(".");
  var canvas = Canvas(400, 300, window.devicePixelRatio || 1);
  var ctx = canvas.getContext("2d");
  var slide2d = Slide2d(ctx, resolveImage);
  document.body.appendChild(canvas);
  return slide2d;
}
