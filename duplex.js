const { createReadStream, createWriteStream } = require('fs');
const {Duplex, PassThrough} = require("stream")

const readStream = createReadStream('./powder-day.mp4')
const writeStream = createWriteStream('./copy.mp4');

/**
 * Duplex streams are intermediate stream which can read & write both.
 * Usually they are either passthrough which only observes & reports, and then there's
 * transform stream which does some transformation
 */

 /**
  * Defining a custom duplex stream, needs to override both write & read
  */
class Throttle extends Duplex {
    constructor(delay) {
        super()
        this.delay = delay
    }

    _write(chunk, encoding, callback) {
        //Simply write the date
        this.push(chunk)
        //Callback is invoked when it has to be indicated that the write is complete
        setTimeout(callback, this.delay)
    }
    //Nothing needs to be done here
    _read() {

    }
    //This is executed when there's no more data to be read, so here we should also clear the write stream
    _final() {
        this.push(null)
    }
}

const report = new PassThrough()
const throttle = new Throttle(10)

let total = 0
report.on('data', (data) => {
    total += data.length
    console.log('bytes', total)
})
readStream.pipe(throttle).pipe(report).pipe(writeStream);
