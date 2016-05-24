#!/usr/bin/env node

var cssnow = require('.')
  , commander = require('commander')
;

commander
  .version(require('./package.json').version)
  .option('-w, --watch', 'Watch mode')
  .arguments('<input> <output>')
  .action(function (input, output, options) {
    cssnow(
      {
        watch:  options.watch,
        input:  input,
        output: output,
      },
      function (err) {
        if (err) {
          console.error(err);
          process.exit(42);
        }
        process.exit(0);
      }
    );
  })
;
