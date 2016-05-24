
# cssnow

Sort of like [cssnext](http://cssnext.io/) used to be.

Back when we were young, cssnext used to be pretty simple: you installed it, you ran it, it worked.
Nowadays, cssnext has evolved to build atop PostCSS.

I have nothing against that move. It's a lot more powerful and flexible. But we have lots of repos,
and they all need a default that's pretty much what cssnext used to be. So what `cssnow` does is
pretty much that: use cssnext and PostCSS with a default setup that matches the sane, basic setup
we need. It's a whole lot fewer direct dependencies to worry about, and a way to centralise options
better than the default (such as being safe out of the box instead of triggering hard-to-find
`z-index` bugs).

## Installation

The usual:

    npm install --save cssnow

## Usage

    cssnow [options] <input> <output>

If `output` is unspecified, it prints to standard out; likewise if `input` is not specified it reads
from standard in.

When `NODE_ENV` is set to `production`, it minifies and does not report errors; otherwise it does
not minify but reports errors. Due to this behaviour, it (currently) produces no source maps.

Options include:

* `-w`, `--watch`: enter watch mode

## API

You can use cssnow as a library. It exports a single function (the default one). Call it with
`options` and a callback. The options (all of which are optional) are:

* `watch`: boolean, enter watch mode or not.
* `input`: input path.
* `output`: output path.

The callback will receive an error if there was one, just `null` otherwise.
