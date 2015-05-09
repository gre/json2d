var drawImage = require("draw-image-normalized");
var rectCrop = require("rect-crop");

var defaults = {
  background: "#000",
  size: [1000, 1000]
};

function Slide2d (context2d) {
  if (!(this instanceof Slide2d))
    return new Slide2d(context2d);
  this.ctx = context2d;
  this._imgs = {};
}

Slide2d.defaults = defaults;

Slide2d.prototype = {
  destroy: function () {
    this._imgs = null;
    this.ctx = null;
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

  imageForUrl: function (url) {
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
  },

  drawOp: function (op, args, ctx) {
    switch (op) {
      case "drawImage":
        drawImage.apply(null, [ ctx, this.imageForUrl(args[0]) ].concat(args.slice(1)));
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
        ctx[op].apply(ctx, args);
    }
  },

  render: function (item) {
    this._item = item;

    var ctx = this.ctx;
    var canvas = ctx.canvas;
    var W = canvas.width;
    var H = canvas.height;
    var bg = item.background || defaults.size;
    var draws = item.draws || [];
    var drawslength = draws.length;
    var size = this.getSize(item);
    var w = size[0];
    var h = size[1];

    ctx.save();
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    var rect = this.getRectangle(item);

    ctx.translate(Math.round(rect[0]), Math.round(rect[1]));
    ctx.scale(rect[2] / w, rect[3] / h);

    for (var i=0; i<drawslength; ++i) {
      var draw = draws[i];
      if (draw instanceof Array) {
        this.drawOp(draw[0], draw.slice(1), ctx);
      }
      else {
        for (var k in draw) {
          ctx[k] = draw[k];
        }
      }
    }
    ctx.restore();
  }
};

module.exports = Slide2d;
