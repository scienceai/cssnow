
var fs = require('fs')
  , path = require('path')
  , npmPath = require('npm-path')
  , join = path.join
  , spawn = require('child_process').spawn
  , once = require('once')
  , devConfig = join(__dirname, 'dev.json')
  , prodConfig = join(__dirname, 'prod.json')
  , dev = JSON.parse(fs.readFileSync(devConfig))
  , prod = JSON.parse(fs.readFileSync(prodConfig))
;

module.exports = function (options, cb) {
  var args = [];
  npmPath({ cwd: __dirname }, function (err) {
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
  });
};

module.exports.development = dev;
module.exports.production = prod;
module.exports.configuration = (process.env.NODE_ENV === 'production') ? prod : dev;
