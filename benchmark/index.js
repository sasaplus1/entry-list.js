const Benchmark = require('benchmark');

const { entryList } = require('../dist/cjs');

// curl -L -o fixture1.json https://api.github.com/repos/sasaplus1/entry-list.js
const fixture1 = require('./fixture1');

const suite = new Benchmark.Suite();

const env = process.env.ENVIRONMENT ? process.env.ENVIRONMENT + ':' : '';

suite
  .add(env + 'entry-list:fixture1', function () {
    entryList(fixture1);
  })
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .run();
