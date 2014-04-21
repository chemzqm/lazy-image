/**
 * Require the module at `name`.
 *
 * @param {String} name
 * @return {Object} exports
 * @api public
 */

function require(name) {
  var module = require.modules[name];
  if (!module) throw new Error('failed to require "' + name + '"');

  if (!('exports' in module) && typeof module.definition === 'function') {
    module.client = module.component = true;
    module.definition.call(this, module.exports = {}, module);
    delete module.definition;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Register module at `name` with callback `definition`.
 *
 * @param {String} name
 * @param {Function} definition
 * @api private
 */

require.register = function (name, definition) {
  require.modules[name] = {
    definition: definition
  };
};

/**
 * Define a module's exports immediately with `exports`.
 *
 * @param {String} name
 * @param {Generic} exports
 * @api private
 */

require.define = function (name, exports) {
  require.modules[name] = {
    exports: exports
  };
};
require.register("component~emitter@1.1.2", function (exports, module) {

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks[event] = this._callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  var self = this;
  this._callbacks = this._callbacks || {};

  function on() {
    self.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks[event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks[event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks[event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

});

require.register("component~xhr-image@master", function (exports, module) {

/**
 * Module dependencies.
 */

var Emitter = require("component~emitter@1.1.2");

/**
 * Expose `Image`.
 */

module.exports = Image;

/**
 * Initialize an `Image` with `src`.
 *
 * @param {String} src
 * @api public
 */

function Image(src) {
  if (!src) throw new TypeError('src required');
  this.xhr = new XMLHttpRequest;
  this.xhr.open('GET', src, true);
  this.xhr.responseType = 'blob';
  this.xhr.onprogress = this.onprogress.bind(this);
  this.xhr.onreadystatechange = this.onchange.bind(this);
  this.xhr.send();
}

/**
 * Mixin emitter.
 */

Emitter(Image.prototype);

/**
 * Abort the request.
 *
 * @api public
 */

Image.prototype.abort = function(){
  this.xhr.abort();
};

/**
 * Handle progress.
 */

Image.prototype.onprogress = function(e){
  e.percent = e.loaded / e.total * 100;
  this.emit('progress', e);
};

/**
 * Handle state changes.
 */

Image.prototype.onchange = function(){
  var state = this.xhr.readyState;

  switch (state) {
    case 1:
      this.emit('open');
      break;
    case 2:
      this.emit('sent');
      break;
    case 3:
      this.emit('receiving');
      break;
    case 4:
      this.emit('load');
      break;
  }
};

});

require.register("component~within-document@0.0.1", function (exports, module) {

/**
 * Check if `el` is within the document.
 *
 * @param {Element} el
 * @return {Boolean}
 * @api private
 */

module.exports = function(el) {
  var node = el;
  while (node = node.parentNode) {
    if (node == document) return true;
  }
  return false;
};
});

require.register("component~mutation-observer@0.0.1", function (exports, module) {

module.exports = window.MutationObserver
  || window.WebKitMutationObserver
  || window.MozMutationObserver;

});

require.register("component~removed@0.0.3", function (exports, module) {

/**
 * Module dependencies.
 */

var Observer = require("component~mutation-observer@0.0.1");

/**
 * Exports the `MutationObserver` based approach
 * or the fallback one depending on UA capabilities.
 */

module.exports = Observer
  ? require("component~removed@0.0.3/dom4.js")
  : require("component~removed@0.0.3/fallback.js");

});

require.register("component~removed@0.0.3/fallback.js", function (exports, module) {

/**
 * Module dependencies.
 */

var withinDocument = require("component~within-document@0.0.1");

/**
 * Expose `removed`.
 */

exports = module.exports = removed;

/**
 * Default interval.
 */

exports.interval = 200;

/**
 * Watch for removal and invoke `fn(el)`.
 *
 * @param {Element} el
 * @param {Function} fn
 * @api public
 */

function removed(el, fn){
  interval(el, fn);
}

/**
 * Watch for removal with an interval.
 *
 * @param {Element} el
 * @param {Function} fn
 * @api private
 */

function interval(el, fn) {
  var id = setInterval(function(){
    if (el.parentNode && withinDocument(el)) return;
    clearInterval(id);
    fn(el);
  }, exports.interval);
}

});

require.register("component~removed@0.0.3/dom4.js", function (exports, module) {

/**
 * Module dependencies.
 */

var withinDoc = require("component~within-document@0.0.1")
  , Observer = require("component~mutation-observer@0.0.1");

/**
 * Expose `removed`.
 */

module.exports = removed;

/**
 * Watched elements.
 *
 * @api private
 */

var watched = [];

/**
 * Set up observer.
 *
* @api private
 */

var observer = new Observer(onchanges);

/**
 * Generic observer callback.
 *
 * @api private
 */

function onchanges(changes){
  // keep track of number of found els
  var found = 0;

  for (var i = 0, l = changes.length; i < l; i++) {
    if (changes[i].removedNodes.length) {
      // allow for manipulation of `watched`
      // from within the callback
      var w = watched.slice();

      for (var i2 = 0, l2 = w.length; i2 < l2; i2++) {
        var el = w[i2][0];

        // check that the element is no longer in the dom
        if (!withinDoc(el)) {
          watched.splice(i2 - found++, 1)[0][1]();

          // abort if nothing else left to watch
          if (!watched.length) observer.disconnect();
        }
      }

      // we only need to loop through watched els once
      break;
    }
  }
}

/**
 * Starts observing the DOM.
 *
 * @api private
 */

function observe(){
  var html = document.documentElement;
  observer.observe(html, {
    subtree: true,
    childList: true
  });
}

/**
 * Watches for the removal of `el` from DOM.
 *
 * @param {Element} el
 * @param {Function} fn
 * @api private
 */

function removed(el, fn){
  // reattach observer if we weren't watching
  if (!watched.length) observe();

  // we add it to the list of elements to check
  watched.push([el, fn]);
}

});

require.register("component~once@0.0.1", function (exports, module) {

/**
 * Identifier.
 */

var n = 0;

/**
 * Global.
 */

var global = (function(){ return this })();

/**
 * Make `fn` callable only once.
 *
 * @param {Function} fn
 * @return {Function}
 * @api public
 */

module.exports = function(fn) {
  var id = n++;

  function once(){
    // no receiver
    if (this == global) {
      if (once.called) return;
      once.called = true;
      return fn.apply(this, arguments);
    }

    // receiver
    var key = '__called_' + id + '__';
    if (this[key]) return;
    this[key] = true;
    return fn.apply(this, arguments);
  }

  return once;
};

});

require.register("component~autoscale-canvas@0.0.3", function (exports, module) {

/**
 * Retina-enable the given `canvas`.
 *
 * @param {Canvas} canvas
 * @return {Canvas}
 * @api public
 */

module.exports = function(canvas){
  var ctx = canvas.getContext('2d');
  var ratio = window.devicePixelRatio || 1;
  if (1 != ratio) {
    canvas.style.width = canvas.width + 'px';
    canvas.style.height = canvas.height + 'px';
    canvas.width *= ratio;
    canvas.height *= ratio;
    ctx.scale(ratio, ratio);
  }
  return canvas;
};
});

require.register("visionmedia~batch@0.5.0", function (exports, module) {
/**
 * Module dependencies.
 */

try {
  var EventEmitter = require("events").EventEmitter;
} catch (err) {
  var Emitter = require("component~emitter@1.1.2");
}

/**
 * Noop.
 */

function noop(){}

/**
 * Expose `Batch`.
 */

module.exports = Batch;

/**
 * Create a new Batch.
 */

function Batch() {
  if (!(this instanceof Batch)) return new Batch;
  this.fns = [];
  this.concurrency(Infinity);
  this.throws(true);
  for (var i = 0, len = arguments.length; i < len; ++i) {
    this.push(arguments[i]);
  }
}

/**
 * Inherit from `EventEmitter.prototype`.
 */

if (EventEmitter) {
  Batch.prototype.__proto__ = EventEmitter.prototype;
} else {
  Emitter(Batch.prototype);
}

/**
 * Set concurrency to `n`.
 *
 * @param {Number} n
 * @return {Batch}
 * @api public
 */

Batch.prototype.concurrency = function(n){
  this.n = n;
  return this;
};

/**
 * Queue a function.
 *
 * @param {Function} fn
 * @return {Batch}
 * @api public
 */

Batch.prototype.push = function(fn){
  this.fns.push(fn);
  return this;
};

/**
 * Set wether Batch will or will not throw up.
 *
 * @param  {Boolean} throws
 * @return {Batch}
 * @api public
 */
Batch.prototype.throws = function(throws) {
  this.e = !!throws;
  return this;
};

/**
 * Execute all queued functions in parallel,
 * executing `cb(err, results)`.
 *
 * @param {Function} cb
 * @return {Batch}
 * @api public
 */

Batch.prototype.end = function(cb){
  var self = this
    , total = this.fns.length
    , pending = total
    , results = []
    , errors = []
    , cb = cb || noop
    , fns = this.fns
    , max = this.n
    , throws = this.e
    , index = 0
    , done;

  // empty
  if (!fns.length) return cb(null, results);

  // process
  function next() {
    var i = index++;
    var fn = fns[i];
    if (!fn) return;
    var start = new Date;

    try {
      fn(callback);
    } catch (err) {
      callback(err);
    }

    function callback(err, res){
      if (done) return;
      if (err && throws) return done = true, cb(err);
      var complete = total - pending + 1;
      var end = new Date;

      results[i] = res;
      errors[i] = err;

      self.emit('progress', {
        index: i,
        value: res,
        error: err,
        pending: pending,
        total: total,
        complete: complete,
        percent: complete / total * 100 | 0,
        start: start,
        end: end,
        duration: end - start
      });

      if (--pending) next()
      else if(!throws) cb(errors, results);
      else cb(null, results);
    }
  }

  // concurrency
  for (var i = 0; i < fns.length; i++) {
    if (i == max) break;
    next();
  }

  return this;
};

});

require.register("ramitos~resize@master", function (exports, module) {
var binds = {};

module.exports.bind = function (element, cb, ms) {
  if(!binds[element]) binds[element] = {};
  var height = element.offsetHeight;
  var width = element.offsetWidth;
  if(!ms) ms = 250;
  
  binds[element][cb] = setInterval(function () {
    if((width === element.offsetWidth) && (height === element.offsetHeight)) return;
    height = element.offsetHeight;
    width = element.offsetWidth;
    cb(element);
  }, ms);
};

module.exports.unbind = function (element, cb) {
  if(!binds[element][cb]) return;
  clearInterval(binds[element][cb]);
};
});

require.register("lazy-image", function (exports, module) {
var XHRImage = require("component~xhr-image@master");
var resize = require("ramitos~resize@master");
var removed = require("component~removed@0.0.3");
var Batch = require("visionmedia~batch@0.5.0");
var Emitter = require("component~emitter@1.1.2");
var once = require("component~once@0.0.1");
var autoscale = require("component~autoscale-canvas@0.0.3");
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

});

require("lazy-image")
