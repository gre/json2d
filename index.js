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

  render: function (item) {
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
    this._renderRec(item.draws || []);
    ctx.restore();
  },

  _renderRec: function (draws) {
    var ctx = this.ctx;
    var drawslength = draws.length;
    for (var i=0; i<drawslength; ++i) {
      var draw = draws[i];
      if (draw instanceof Array) {
        var op = draw[0];
        if (op instanceof Array) {
          // Nested Draws
          ctx.save();
          this._renderRec(draw);
          ctx.restore();
        }
        else {
          // Draw Operation
          this._renderOp(draw[0], draw.slice(1), ctx);
        }
      }
      else {
        // Styles changes
        for (var k in draw) {
          ctx[k] = draw[k];
        }
      }
    }
  },

  _renderOp: function (op, args, ctx) {
    switch (op) {
      case "drawImage":
        drawImage.apply(null, [ ctx, this._imageForUrl(args[0]) ].concat(args.slice(1)));
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
