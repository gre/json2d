var rectCrop = require("rect-crop");

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

    ctx.save();
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    var rect = rectCrop.largest({ width: w, height: h }, canvas);

    ctx.translate(Math.round(rect[0]), Math.round(rect[1]));
    ctx.scale(rect[2] / w, rect[3] / h);

    for (var i=0; i<draws.length; ++i) {
      var draw = draws[i];
      if (draw instanceof Array) {
        var args = draw.slice(1);
        ctx[draw[0]].apply(ctx, args);
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
