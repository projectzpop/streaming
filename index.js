const fs = require('fs');
const HLS = require('hls-server');
const http = require('http');
const url = require('url');

const audioPath = 'audio/test/';
const PORT = 3000;

const server = http.createServer();
const hls = new HLS(server, {
  provider: {
    exists(req, callback) {
      console.log('exists function called');
      callback(null, true);
      // callback(new Error('Server Error!'));
      // callback(null, false);
    },
    getManifestStream(req, callback) {
      console.log('getManifestStream function called');
      const manifestStream = fs.createReadStream(`${audioPath}test.m3u8`);
      callback(null, manifestStream);
      // or
      // callback(new Error('Server error!'), null);
    },
    getSegmentStream(req, callback) {
      console.log('getSegmentStream function called');
      const uri = url.parse(req.url).pathname;
      const ext = uri.split('.').pop();
      if (ext === 'ts') {
        const filePath = audioPath + uri;
        const tsFileStream = fs.createReadStream(filePath);
        callback(null, tsFileStream);
      }
    },
  },
});

server.listen(PORT);
