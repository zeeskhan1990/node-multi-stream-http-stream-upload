const http = require('http')
const {stat, createReadStream, createWriteStream} = require('fs')
const {promisify} = require("util")
const multiparty = require("multiparty")

const fileName = './powder-day.mp4'
const fileInfo = promisify(stat)

const respondWithVideo = async (req, res) => {
    const {size} = await fileInfo(fileName)
    /**
     * The range request is made by the browser, range comes in the format 'bytes=0-1000', for initial 'bytes=0-'
     */
    const range = req.headers.range
    console.log(range)
    if(range) {
        let [start, end] = range.replace(/bytes=/g, '').split('-')
        start = parseInt(start, 10)
        end = end ? parent(end, 10) : size -1 //0 based index for bytes
        //206 indicates a partial response, accept ranges tells the accepted format which is bytes here
        res.writeHead(206, {
            'Content-Range': `bytes ${start}-${end}/${size}`,
            'Content-Length': (end-start) + 1,
            'Accept-Ranges': 'bytes',
            'Content-Type': 'video/mp4'
        })
        //createReadStream already has provision to read a range
        createReadStream(fileName, {start, end}).pipe(res)
    } else {
        res.writeHead(200,{
            'Content-Length': size,
            'Content-Type': 'video/mp4'})
        createReadStream(fileName).pipe(res)
    }
    
}

const app = http.createServer((req, res) => {
    if (req.method === 'POST') {
    /**
     * The upload form when submitted would be received here as a readable stream.
     * The request stream is simply being forked and piped into multiple other streams 
     */
      // req.pipe(res);
      // req.pipe(process.stdout);
      // req.pipe(createWriteStream('./upload.file'));

      let form = new multiparty.Form()

      form.on('part', (part) => {
        //A part is either an upload or a form data as a readable stream
        part.pipe(createWriteStream(`./${part.filename}`)).on('close', () => {
          res.writeHead(200, {'Content-Type': 'text/html'})
          res.end('<h1> Hello Upload </h1>')
        })
      })
      /**Parses an incoming request containing form data and will cause form to emit events based off the incoming request */
      form.parse(req)

    } else if (req.url === '/video') {
      respondWithVideo(req, res);
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(`
        <form enctype="multipart/form-data" method="POST" action="/">
          <input type="file" name="upload-file" />
          <button>Upload File</button>
        </form>
      `);
    }  
  })

app.listen(3000, console.log("The server is listening..."))