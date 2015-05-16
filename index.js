var drawImage = require("draw-image-normalized");
var rectCrop = require("rect-crop");

var defaults = {
  background: "#000",
  size: [1000, 1000],
  draws: []
};

function UnsupportedDrawOperation (reason, path) {
  var temp = Error.call(this, reason);
  this.name = temp.name = "UnsupportedDrawOperation";
  this.stack = temp.stack;
  this.message = temp.message;
  this.path = path;
}
UnsupportedDrawOperation.prototype = Object.create(Error.prototype, {
    constructor: {
        value: UnsupportedDrawOperation,
        writable: true,
        configurable: true
    }
});

function Slide2d (context2d, imgsCache) {
  if (!(this instanceof Slide2d))
    return new Slide2d(context2d, imgsCache);
  this.ctx = context2d;
  this.setImgsCache(imgsCache);
}

Slide2d.defaults = defaults;

Slide2d.prototype = {
  destroy: function () {
    this._item = null;
    this._imgs = null;
    this.ctx = null;
  },

  setImgsCache: function (imgsCache) {
    this._imgs = {};
    if (imgsCache) {
      for (var k in imgsCache) {
        this._imgs[k] = imgsCache[k];
      }
    }
  },

  getSize: function (item) {
    return item.size || defaults.size;
  },

  getRectangle: function (item) {
    var size = this.getSize(item);
    var w = size[0];
    var h = size[1];
    return rectCrop.largest({ width: w, height: h }, this.ctx.canvas);
  },

  render: function (item, visitor) {
    this._item = item;

    var ctx = this.ctx;
    var canvas = ctx.canvas;
    var W = canvas.width;
    var H = canvas.height;
    var bg = item.background || defaults.size;
    var size = this.getSize(item);
    var rect = this.getRectangle(item);
    var w = size[0];
    var h = size[1];

    ctx.save();
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);
    ctx.translate(Math.round(rect[0]), Math.round(rect[1]));
    ctx.scale(rect[2] / w, rect[3] / h);
    this._renderRec(item.draws || defaults.draws, [], visitor || function(){});
    ctx.restore();
  },

  _renderRec: function (draws, path, visitor) {
    var ctx = this.ctx;
    var drawslength = draws.length;
    for (var i=0; i<drawslength; ++i) {
      var draw = draws[i];
      var p = path.concat([ i ]);
      if (draw instanceof Array) {
        var op = draw[0];
        if (typeof op === "object") {
          // Nested Draws
          ctx.save();
          this._renderRec(draw, p, visitor);
          ctx.restore();
        }
        else {
          // Draw Operation
          this._renderOp(op, draw.slice(1), p);
        }
      }
      else {
        // Styles changes
        for (var k in draw) {
          ctx[k] = draw[k];
        }
      }
      visitor(p, draw);
    }
  },

  _renderOp: function (op, args, path) {
    var ctx = this.ctx;
    if (typeof op !== "string") {
      throw new UnsupportedDrawOperation("must be a string operation: " + op, path);
    }
    switch (op) {
      case "drawImage":
        var img = typeof args[0] === "string" ? this._imageForUrl(args[0]) : img;
        drawImage.apply(null, [ ctx, img ].concat(args.slice(1)));
        break;

      case "fillText":
      case "strokeText":
        var text = args[0];
        var lines = text.split("\n");
        var lineslength = lines.length;
        var x = args[1];
        var y = args[2];
        if (lineslength === 1 || args.length < 4) {
          // Simply apply the operation
          ctx[op].call(ctx, text, x, y);
        }
        else {
          // Extend the text operation into multi-line text
          var lineHeight = args[3];
          for (var i=0; i<lineslength; ++i) {
            ctx[op].call(ctx, lines[i], x, y + i * lineHeight);
          }
        }
        break;

      default:
        var f = ctx[op];
        if (typeof f === "function")
          f.apply(ctx, args);
        else
          throw new UnsupportedDrawOperation(op, path);
    }
  },

  _imageForUrl: function (url) {
    if (url in this._imgs) {
      return this._imgs[url];
    }
    var img = new window.Image();
    img.crossOrigin = true;
    img.src = url;
    this._imgs[url] = img;
    img.onload = function () {
      if (this._item) this.render(this._item);
    }.bind(this);
    return img;
  }
};

module.exports = Slide2d;
