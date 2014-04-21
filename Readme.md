# Lazy-image

  Load image with progress and error control.

  Seems Chrome not support reading the content-length of a download XHR, thus we don't know the percentage.

## Installation

  Install with [component(1)](http://component.io):

    $ component install chemzqm/lazy-image

## Example

images should contain attribute `data-src` as their real src attribute.

``` js
var image = require("lazy-image");

var el = document.getElementById('images');
image(el, function(err) {
  notice('Your network seems broken');
})
```

## API

### image(container, [opt], [callback])

* `container` is element contains images, with automatic change(size change and removed) detect.
* `opt.concurrency` <2> can be used to set the concurrency count.
* `callback` is called with err as first argument.

## License

  The MIT License (MIT)

  Copyright (c) 2014 <copyright chemzqm@gmail.com>

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
