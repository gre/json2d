var rectCrop = require("rect-crop");

function drawOp (op, args, ctx) {
  switch (op) {
    case "fillText":
    case "strokeText":
      var lines = args[0].split("\n");
      var lineslength = lines.length;
      var x = args[1];
      var y = args[2];
      if (lineslength === 1 || args.length < 4) {
        // Simply apply the operation
        ctx[op].apply(ctx, args);
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
}

function Slide2d (context2d) {
  if (!(this instanceof Slide2d))
    return new Slide2d(context2d);
  this.ctx = context2d;
}

Slide2d.prototype = {
  render: function (item) {
    var ctx = this.ctx;
    var canvas = ctx.canvas;
    var W = canvas.width;
    var H = canvas.height;
    var size = item.size || [ 1000, 1000 ];
    var w = size[0];
    var h = size[1];
    var bg = item.background || "#000";
    var draws = item.draws || [];
    var drawslength = draws.length;

    ctx.save();
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    var rect = rectCrop.largest({ width: w, height: h }, canvas);

    ctx.translate(Math.round(rect[0]), Math.round(rect[1]));
    ctx.scale(rect[2] / w, rect[3] / h);

    for (var i=0; i<drawslength; ++i) {
      var draw = draws[i];
      if (draw instanceof Array) {
        drawOp(draw[0], draw.slice(1), ctx);
      }
      else {
        for (var k in draw) {
          ctx[k] = draw[k];
        }
      }
    }
  }
};

module.exports = Slide2d;
