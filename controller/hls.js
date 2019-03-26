const fs = require('fs');
const path = require('path');

const audioRoot = './audio';


const setAuth = () => {
  console.log('auth!!!');
};

const example = (req, res) => {
  console.log(req.originalUrl);
  const url = req.originalUrl.split('/');
  const last = url[url.length - 1];
  let target;
  let filePath;

  if (last.endsWith('.ts')) {
    target = last.split('.')[0];
    const num = target.replace(/[^0-9]/g, '');
    const targetReal = target.substring(0, target.length - num.length);
    // res.end('get ts');

    filePath = `${path.resolve(audioRoot, targetReal)}/${target}.ts`;

    res.status(200).set('Content-Type', 'video/MP2T');
    fs.createReadStream(filePath).pipe(res);
  } else {
    target = last.split('.')[0];
    filePath = `${path.resolve(audioRoot, target)}/${target}.m3u8`;
    // res.end(filePath);
    res.status(200).set('Content-Type', 'application/vnd.apple.mpegurl');
    fs.createReadStream(filePath).pipe(res);
  }
};


module.exports = {
  example,
};
