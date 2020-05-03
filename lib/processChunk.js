const getOptionsArray = require("./getOptionsArray");
const transform = require("./template-ref-transformer");

function processChunk(source, map) {
  this.cacheable();

  const optionsArray = getOptionsArray(this);
  let newSource = source;

  for (const options of optionsArray) {
    newSource = transform(newSource, options);
  }

  this.callback(null, newSource, map);
}

module.exports = processChunk;
