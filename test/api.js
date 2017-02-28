
var cssnow = require('..')
  , fs = require('fs')
  , join = require('path').join
  , assert = require('assert')
  , shortid = require('shortid')
  , binPath = join(__dirname, '../node_modules/.bin')
  , simpleCSS = join(__dirname, 'fixtures/simple.css')
  , brokenCSS = join(__dirname, 'fixtures/broken.css')
  , delFiles = []
;

function run (src, cb) {
  var file = join(__dirname, 'fixtures', shortid.generate());
  delFiles.push(file);
  cssnow({ input: src, output: file, execDir: binPath }, function (err) {
    if (err) return cb(err);
    cb(null, fs.existsSync(file) && fs.readFileSync(file, 'utf8'));
  })
}

describe('API', function () {
  this.timeout(10 * 1000);
  after('clean up the files', function () {
    delFiles.forEach(function (f) {
      if (fs.existsSync(f)) fs.unlinkSync(f);
    });
  });
  it('reports errors', function (done) {
    run(brokenCSS, function (err, out) {
      assert(err, 'there must be an error');
      assert(!out, 'there must be no result');
      done();
    });
  });
  it('does not minify in development', function (done) {
    process.env.NODE_ENV = 'development';
    run(simpleCSS, function (err, out) {
      assert.ifError(err);
      assert(out.match(/(\n)/g).length > 7, 'plenty of newlines left');
      done();
    });
  });
  it('minifies in production', function (done) {
    process.env.NODE_ENV = 'production';
    run(simpleCSS, function (err, out) {
      assert.ifError(err);
      assert.equal(out.match(/(\n)/g), null, 'minification worked');
      done();
    });
  });
  it('remains safe even under minification', function (done) {
    process.env.NODE_ENV = 'production';
    run(simpleCSS, function (err, out) {
      assert.ifError(err);
      assert(out.match(/80/), 'z-index wasn\'t killed');
      done();
    });
  });
  it('exports configurations', function () {
    assert(cssnow.development, 'exports development');
    assert(cssnow.production, 'exports production');
    assert(cssnow.configuration, 'exports resolved');
    assert(cssnow.development.map, 'correct development');
    assert(cssnow.production['no-map'], 'correct production');
    assert.deepEqual(cssnow.development, cssnow.configuration, 'right resolved');
  });
});
