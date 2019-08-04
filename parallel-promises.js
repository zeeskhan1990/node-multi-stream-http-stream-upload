const fs = require('fs');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);
const delay = (seconds) => new Promise((resolves) => {
    setTimeout(resolves, seconds*1000);
})

//Similar but wait for all promises to be resolved - Promise.all, either way the promises are being executed "parallely"
Promise.race([
  delay(5),
  delay(2),
  delay(3),
  delay(5)
]).then(() => readdir(__dirname))
  .then(console.log);
