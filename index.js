
var fs = require('fs')
  , join = require('path').join
  , spawn = require('npm-run').spawn
  , once = require('once')
  , devConfig = join(__dirname, 'dev.json')
  , prodConfig = join(__dirname, 'prod.json')
;

module.exports = function (options, cb) {
  var args = [];
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
  var child = spawn('postcss', args, { stdio:  ['inherit', 'inherit', 'pipe'] })
    , end = once(cb)
    , error = null
  ;
  child.stderr.on('data', function (data) {
    if (!error) error = '';
    error += data;
  });
  child.on('error', end);
  child.on('exit', function () { end(error); });
};
