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
  // const target = 'test';
  // const filePath = `${path.resolve(audioRoot, target)}/${req.params[0]}`;
  // console.log(filePath);
  // ... Here you would do some Auth (userId, sessionId/cookie info validation)

  //
  // fs.stat(filePath, (err, stats) => {
  //   if (!stats || err) {
  //     res.status(404).end();
  //   } else {
  //     let fileExt = filePath.slice(filePath.lastIndexOf('.'));
  //     fileExt = fileExt && fileExt.toLowerCase() || fileExt;
  //   }
  // });
  //
  //
  // switch (fileExt) {
  //   case '.m3u8':
  //     res.status(200).set('Content-Type', 'application/vnd.apple.mpegurl');
  //     target = `${req.params[0]}`;
  //     filePath = `${path.resolve(audioRoot, target)}/${target}.m3u8`;
  //     fs.createReadStream(filePath).pipe(res);
  //     break;
  //   case '.ts':
  //     res.status(200).set('Content-Type', 'video/MP2T');
  //     fs.createReadStream(filePath).pipe(res);
  //     break;
  //   default:
  //     res.status(400).send(`Unexpected file type ${fileExt}`);
  // }

};

const getM3u8 = (req, res) => {
  console.log('getM3u8');

  // TODO: DB 연동
  const target = 'test';
  res.status(200).set('Content-Type', 'application/vnd.apple.mpegurl');

  const filePath = `${path.resolve(audioRoot, target)}/${target}.m3u8`;
  console.log(filePath);
  fs.createReadStream(filePath).pipe(res);
};

const getTs = (req, res) => {
  console.log('getTs');

  // TODO: DB 연동
  const target = 'test';
  res.status(200).set('Content-Type', 'video/MP2T');

  const filePath = `${path.resolve(audioRoot, target)}/${req.params[0]}`;
  console.log(filePath);
  fs.createReadStream(filePath).pipe(res);
};


module.exports = {
  getM3u8,
  getTs,
  example,
};
