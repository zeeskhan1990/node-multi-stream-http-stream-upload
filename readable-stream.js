const {Readable} = require("stream")

const peaks = [
    "Tallac",
    "Ralston",
    "Rubicon",
    "Twin Peaks",
    "Castle Peak",
    "Rose",
    "Freel Peak"
];
/**
 * http request, process stdin, file read, tcp socket all of them uses readable stream
 */
class StreamFromArray extends Readable {
    constructor(array) {
        /* Read the data as a object */
        super({objectMode: true})
        /* The stream would read it in binary mode, either it can be as a buffer or a string(utf-8) */
        //super({encoding: 'UTF-8'})
        this.array = array
        this.index = 0
    }

    _read() {
        if(this.index <= this.array.length) {
            const currentChunk = this.array[this.index]
            //this.push(currentChunk)
            /* For it to be read as an object */
            this.push({
                data: currentChunk,
                index: this.index
            })
            this.index+=1
        } else {
            this.push(null)
        }        
    }
}

const myArrayStream = new StreamFromArray(peaks)

myArrayStream.on('data', (data) => {
    console.log(data)
})

myArrayStream.on('end', () => {
    console.log("The stream has ended")
})


