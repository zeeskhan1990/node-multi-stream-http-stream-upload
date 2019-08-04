const {createReadStream, createWriteStream, unlinkSync, exists} = require('fs')

const readStream = createReadStream('./powder-day.mp4')
const pausingReadStream = createReadStream('./powder-day.mp4')

const writeStream = createWriteStream('./copy.mp4')

readStream.on('data', (data) => {
    console.log("Video chunk\n ", data.length)
    writeStream.write(data)
})

readStream.on('end', (data) => {
    console.log("Video ended\n ", data)
    writeStream.end()
})

readStream.on('error', (error) => {
    console.log("Video error\n ", data)
})

writeStream.on('close', () => {
    process.stdout.write("File copied")
    exists('./copy.mp4', (exists) => {
        if(exists) {
            unlinkSync('./copy.mp4')
            console.log("\nFile Deleted")
        }
        console.log("Read Write Done")
    })    

})

pausingReadStream.on('data', (data) => {
    console.log("Pausing Read Stream read....\n ")
    console.log(data.length)
})
pausingReadStream.on('end', (data) => {
    console.log("Pausing Video ended\n ", data)
    process.exit()
})

pausingReadStream.pause()

/**This stream is in a non-flowing mode, i.e, the stream is not continously feeding
 * of a source of data, rather on defined signals it's extracting the next chunk. This is 
 * in contrast to the default behavior of file read stream which is in a flowing mode
 */
process.stdin.on('data', (input) => {
    input = input.toString().trim()
    console.log("Input provided is ", input)
    if(input === "finish") {
        pausingReadStream.resume()
    }
    //Since the stream is being read here, this should invoke any on
    pausingReadStream.read()
})




