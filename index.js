var XHRImage = require("xhr-image");
var resize = require('resize');
var removed = require('removed');
var Batch = require('batch');
var Emitter = require("emitter");
var once = require('once');
var autoscale = require('autoscale-canvas');
var styles = window.getComputedStyle;


module.exports = function (el, opt, cb) {
  var tasks = [];
  if (typeof opt === 'function') {
    cb = opt;
    opt = {};
  }
  opt = opt || {};
  detect(tasks, el, opt, cb);
  //check for element change
  resize.bind(el, function () {
    detect(tasks, el, opt, cb);
  })
  //check for element remove
  removed(el, function () {
    tasks.forEach(function (task) {
      task.unbind();
    })
  })
}


function detect(tasks, el, opt, cb) {
  var imgs = el.querySelectorAll('img');
  var batch = new Batch();
  batch.concurrency(opt.concurrency || 4);
  imgs = [].slice.call(imgs);
  imgs.forEach(function(img) {
    if (img.hasAttribute('data-src')) {
      batch.push(function(done) {
        var task = new Task(img, done);
        tasks.push(task);
      });
    }
  })
  batch.end(function(err) {
    if(cb) cb(err);
  })
}

function Task(img, cb) {
  if (! (this instanceof Task)) return new Task(img, cb);
  this.img = img;
  this.cb = once(cb);
  var src = img.getAttribute('data-src');
  //ensure only once
  img.removeAttribute('data-src');
  var loader = this.loader = new XHRImage(src);
  loader.xhr.onerror = this.onerror.bind(this);
  loader.on('progress', this.onprogress.bind(this));
  loader.on('load', this.onload.bind(this));
  this.canvas = document.createElement('canvas');
  this.ctx = this.canvas.getContext('2d');
  this.canvas.width = parseInt(styles(img).width, 10);
  this.canvas.heigth = parseInt(styles(img).height, 10);
  autoscale(this.canvas);
}

Task.prototype.onprogress = function (e) {
  var percent = e.percent;
  if (!isFinite(percent)) return;
  this.draw(percent);
}

Task.prototype.onload = function () {
  var xhr = this.loader.xhr;
  var status = xhr.status;
  if (status < 200 || status > 400) {
    return this.onerror();
  }
  var img = this.img;
  var url = xhr.response;
  this.img.src = URL.createObjectURL(url);
  this.img.onload = function () {
    //clean
    window.URL.revokeObjectURL(url);
    this.unbind();
  }.bind(this);
}

Task.prototype.onerror = function (e) {
  var msg = !!e ? 'can\'t require' : 'image request error';
  var err = new Error(msg);
  err.el = this.img;
  this.cb(err);
  this.unbind();
}

/**
 * unbind events
 *
 * @api private
 */
Task.prototype.unbind = function () {
  //cancel loading
  if (!this.img) return;
  delete this.img;
  if (this.loader.xhr.readyState !== 4) {
    this.loader.abort();
  }
  this.loader.off();
  this.cb();
}

Task.prototype.draw = function (percent) {
    percent = Math.min(percent || 0, 100);
    var ctx = this.ctx
    , ratio = window.devicePixelRatio || 1
    , size = this.canvas.width / ratio
    , x = this.canvas.width/(2 * ratio)
    , y = this.canvas.height/(2 * ratio)
    , fontSize = 11;
  ctx.font = fontSize + 'px helvetica, arial, sans-serif';
  if (percent !== 100) percent = percent.toFixed(1);

  ctx.clearRect(0, 0, size, size);

  ctx.stroke();

  // text
  var text = percent + '%'
    , w = ctx.measureText(text).width;

  ctx.fillText(
      text
    , x - w / 2 + 1
    , y + fontSize / 2 - 1);
  this.img.src = this.canvas.toDataURL();
}

function noob() { }
