
var fs = require('fs')
  , path = require('path')
  , join = path.join
  , spawn = require('child_process').spawn
  , whereis = require('whereis')
  , once = require('once')
  , devConfig = join(__dirname, 'dev.json')
  , prodConfig = join(__dirname, 'prod.json')
;

// search for the postcss-cli executable, as it may have been squirelled away (notably under npm2)
// we look (in order): in the same dir as our own cli tool, in every $directory/node_modules/.bin
// walking up from this module, in the $PATH.
function findPostCSSCli (execDir, cb) {
  var candidates = [execDir]
    , steps = __dirname.replace(/\/+$/, '').split(path.sep)
  ;
  while (steps.length > 1) {
    candidates.push(join.apply(null, steps.concat(['node_modules/.bin'])));
    steps.pop();
  }
  console.log('candidates', candidates);
  var testNext = function () {
    var nxt = candidates.shift();
    console.log('trying', nxt);
    if (!nxt) {
      whereis('postcss', cb);
    }
    else {
      findbin(join(nxt, 'postcss'), function (err, path) {
        if (!err) return cb(null, path);
        testNext();
      });
    }
  };
  testNext();
}

function findbin (path, cb) {
  fs.access(path, fs.X_OK, function (err) {
    if (err) return cb(err);
    cb(null, path);
  });
}

module.exports = function (options, cb) {
  var args = [];
  findPostCSSCli(options.execDir, function (err, execPath) {
    if (err) return cb(err);
    if (options.watch) args.push('--watch');
    args.push('--config');
    args.push((process.env.NODE_ENV === 'production') ? prodConfig : devConfig);
    if (options.output) {
      args.push('--output');
      args.push(options.output);
    }
    if (options.input) {
      args.push('--input');
      args.push(options.input);
    }
    var child = spawn(execPath, args, { stdio:  ['inherit', 'inherit', 'pipe'] })
      , end = once(cb)
      , error = null
    ;
    child.stderr.on('data', function (data) {
      if (!error) error = '';
      error += data;
    });
    child.on('error', end);
    child.on('exit', function () { end(error); });
  });
};
