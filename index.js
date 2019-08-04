const { promisify } = require('util');

// A sync function
function hideStringSync(str) {
    return str.replace(/[a-zA-Z]/g, 'X');
}

var hidden = hideStringSync("Hello World");
console.log( hidden );
console.log("end")

//An async one in a callback pattern with async behavior introduced by nextTick
function hideString(str, done) {
    //Wait till the next tick, i.e, end of the current event loop cycle
    process.nextTick(() => {
        done(str.replace(/[a-zA-Z]/g, 'X'))
    })
}

hideString("Hello World", (hidden) => {
    console.log(hidden)
})

console.log("end")

function delay(seconds, callback) {
    setTimeout(callback, seconds*1000)
}
//Example of sequentially ordered async code [also callback hell - should be handled with then/async-await]
delay(2, () => {
    console.log("2 sec")
    delay(1, () => {
        console.log("1 sec")
        delay(3, () => {
            console.log("3 sec")
        })
    })
})

/**
 * Promisify converts callback functions to promises. 
 * A callback function as per node conventions is one that is of format (arg1, callback)
 * And the 'callback' is invoked as callback(error) in case of error, or callback(null, ...rest)
 * in case of valid executions
 */
const writeFile = promisify(fs.writeFile);

writeFile('sample.txt', 'This is a sample')
  .then(() => console.log('file successfully created'))
  .catch((error) => console.log('error creating file'));