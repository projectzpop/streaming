const moment = require('moment-timezone');

describe('time test', () => {
  it('change timezone', async () => {
    console.log(new Date());
    console.log(moment());
    console.log(moment().toString());
    console.log(moment().toISOString());
    console.log(moment().tz('Asia/Seoul').toString());
    console.log(moment(new Date()).tz('Asia/Seoul').toString());
    console.log(moment(new Date()).tz('Asia/Seoul').toISOString());
    console.log();
    console.log(new Date().getHours());
    console.log(moment(new Date()).tz('Asia/Seoul').hour());
    console.log(moment(new Date()).tz('America/New_York').hour());

    console.log(moment(new Date()).tz('Asia/Seoul').hour());
    console.log(moment(new Date(1554182516061)).tz('Asia/Seoul').hour());

    const timeStandard = new Date();
    const timeStandard2 = moment().tz('Asia/Seoul');
    let start = moment(timeStandard).tz('Asia/Seoul').hour(parseInt('03', 10)).minute(parseInt('20', 10));
    let close = moment(timeStandard).tz('Asia/Seoul').hour(parseInt('18', 10)).minute(parseInt('30', 10));

    let target = moment(timeStandard).tz('Asia/Seoul').hour(timeStandard2.hour()).minute(timeStandard2.minute());

    console.log(target.isBetween(start, close, 'minute', '[]'));

    console.log(moment(new Date(1554009716061)).tz('Asia/Seoul').day());

  });
});
