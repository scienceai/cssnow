
var fs = require('fs')
  , join = require('path').join
  , spawn = require('child_process').spawn
  , once = require('once')
  , devConfig = join(__dirname, 'dev.json')
  , prodConfig = join(__dirname, 'prod.json')
;

module.exports = function (options, cb) {
  let args = [];
  if (options.watch) args.push('--watch');
  args.push('--config');
  args.push((process.env.NODE_ENV === 'production') ? prodConfig : devConfig);
  if (options.output) {
    args.push('--output');
    args.push(output);
  }
  if (options.input) args.push(input);
  var child = spawn('postcss', args, { stdio:  'inherit' })
    , end = once(cb)
  ;
  child.on('error', end);
  child.on('exit', function () { end(); });
};
