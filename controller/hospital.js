const uuid = require('uuid').v4;
const mysql = require('mysql2/promise');
const parser = require('fast-xml-parser');
const request = require('request-promise-native');
const qs = require('querystring');
const _ = require('underscore');
const { task } = require('../util/asyncHelper');
const moment = require('moment-timezone');

const HELP_FILE_PATH = '';
const API_ROOT_PATH = 'http://apis.data.go.kr/B552657/HsptlAsembySearchService/getHsptlMdcncListInfoInqire';
const API_SERVICE_KEY = 'p%2BUqp%2BEgDAVoFs46fE2t6wh9i0oaQQQEfUgE%2FIoPDjFs3lkiBWay3eYPV6FOHiCYFC3zjuSslHQx6Lfi6o3KdA%3D%3D';
const subjectMap = {
  내과: 'D001',
  소아청소년과: 'D002',
  신경과: 'D003',
  정신건강의학과: 'D004',
  피부과: 'D005',
  외과: 'D006',
  흉부외과: 'D007',
  정형외과: 'D008',
  신경외과: 'D009',
  성형외과: 'D010',
  산부인과: 'D011',
  안과: 'D012',
  이비인후과: 'D013',
  비뇨기과: 'D014',
  재활의학과: 'D016',
  마취통증의학과: 'D017',
  영상의학과: 'D018',
  치료방사선과: 'D019',
  임상병리과: 'D020',
  해부병리과: 'D021',
  가정의학과: 'D022',
  핵의학과: 'D023',
  응급의학과: 'D024',
  치과: 'D026',
  구강악안면외과: 'D034',
  D001: 'D001',
  D002: 'D002',
  D003: 'D003',
  D004: 'D004',
  D005: 'D005',
  D006: 'D006',
  D007: 'D007',
  D008: 'D008',
  D009: 'D009',
  D010: 'D010',
  D011: 'D011',
  D012: 'D012',
  D013: 'D013',
  D014: 'D014',
  D016: 'D016',
  D017: 'D017',
  D018: 'D018',
  D019: 'D019',
  D020: 'D020',
  D021: 'D021',
  D022: 'D022',
  D023: 'D023',
  D024: 'D024',
  D026: 'D026',
  D034: 'D034',
};

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'sun',
  database: 'nugu',
});

class Directive {
  constructor({ type, audioItem }) {
    this.type = type;
    this.audioItem = audioItem;
  }
}

function audioPlayerDirective(soundFileName) {
  return new Directive({
    type: 'AudioPlayer.Play',
    audioItem: {
      stream: {
        url: soundFileName,
        offsetInMilliseconds: 0,
        token: uuid(),
        expectedPreviousToken: 'expectedPreviousToken',
      },
    },
  });
}

class NPKRequest {
  constructor(httpReq) {
    this.context = httpReq.body.context;
    this.action = httpReq.body.action;
    console.log(`\nNPKRequest: ${JSON.stringify(this.context)}, ${JSON.stringify(this.action)}`);
  }

  async do(npkResponse) {
    await this.actionRequest(npkResponse);
  }

  async actionRequest(npkResponse) {
    const conn = await pool.getConnection(async con => con);

    console.log('\nactionRequest');
    console.dir(this.action);

    const { actionName } = this.action;
    const { parameters } = this.action;

    let error;
    let result;
    let final;
    const si = (parameters.si) ? parameters.si.value : null;
    const gu = (parameters.gu) ? parameters.gu.value : null;
    const dong = (parameters.dong) ? parameters.dong.value : null;
    const subject = (parameters.subject) ? parameters.subject.value : null;
    const isOpen = (parameters.isOpen) ? parameters.isOpen.value : 'false';

    switch (actionName) {
      case 'getHospital':
        if (si !== null && gu !== null) {
          [error, result] = await task(this.getHospital(conn, {
            si, gu, dong, subject, isOpen,
          }));

          if (error || !Array.isArray(result)) {
            final = {
              errCode: 'fail',
            };
          } else if (result.length <= 0) {
            final = {
              hospitalResult: '검색결과가 없습니다. ',
            };
          } else {
            final = {
              hospitalResult: `${result.join(', ')} 입니다. `,
            };
          }
        } else {
          final = {
            errCode: 'fail',
          };
        }

        npkResponse.setOutputParameters(final);
        break;
      case 'hospitalHelp':
        npkResponse.addDirective(audioPlayerDirective(HELP_FILE_PATH));
        break;
      default:
        break;
    }
    conn.release();
  }

  async getHospital(connection, params) {
    try {
      const {
        si, gu, dong, subject, isOpen,
      } = params;

      let url = `${API_ROOT_PATH}?ServiceKey=${API_SERVICE_KEY}`;
      url += `&Q0=${qs.escape(si)}&Q1=${qs.escape(gu)}`;

      if (typeof subject === 'string' && subject.length !== 0) {
        url += `&QD=${subject}`;
      }

      let result = await request({
        method: 'GET',
        url,
      });

      let obj = null;
      let totalCount = -1;
      if (parser.validate(result)) {
        obj = parser.parse(result);
        totalCount = obj.response.body.totalCount;
      }

      if (totalCount <= 0) {
        return [];
      }

      const pageNo = this.getRandomPage(totalCount, 10);
      url += `&pageNo=${pageNo}`;
      result = await request({
        method: 'GET',
        url,
      });

      obj = null;
      totalCount = -1;
      if (parser.validate(result)) {
        obj = parser.parse(result, { parseNodeValue: false });
        totalCount = obj.response.body.items.item.length;
      }

      if (totalCount <= 0) {
        return [];
      }

      let hospitalList = JSON.parse(JSON.stringify(obj.response.body.items.item));
      let finalData = [];

      if (isOpen.toUpperCase() === 'true'.toUpperCase()) {
        const current = moment().tz('Asia/Seoul');
        const holList = await this.getHolidays(connection, 2019);
        const isHoliday = (typeof holList.find(hol => hol.year === current.year() && hol.month === (current.month() + 1) && hol.day === current.date()) !== 'undefined');
        console.log(isHoliday);

        // for
        for (let i = 0; i < hospitalList.length; i += 1) {
          const hospital = hospitalList[i];

          // 요일 보정
          let dayOfWeek = current.day() === 0 ? 7 : current.day();
          if (isHoliday) dayOfWeek = 8;

          const startStr = `dutyTime${dayOfWeek}s`;
          const closeStr = `dutyTime${dayOfWeek}c`;

          // 해당 요일/공휴일 영업 안함
          if (typeof hospital[startStr] !== 'string'
            || typeof hospital[closeStr] !== 'string'
            || hospital[startStr].length !== 4
            || hospital[closeStr].length !== 4) {
            continue;
          }

          // 영업 중인지 계산
          const timeStandard = new Date();
          const timeStandard2 = moment().tz('Asia/Seoul');
          const startTime = moment(timeStandard).tz('Asia/Seoul').hour(parseInt(hospital[startStr].substr(0, 2), 10)).minute(parseInt(hospital[closeStr].substr(2), 10));
          const closeTime = moment(timeStandard).tz('Asia/Seoul').hour(parseInt(hospital[closeStr].substr(0, 2), 10)).minute(parseInt(hospital[closeStr].substr(2), 10));
          const target = moment(timeStandard).tz('Asia/Seoul').hour(timeStandard2.hour()).minute(timeStandard2.minute());

          if (target.isBetween(startTime, closeTime, 'minute', '[]')) finalData.push(hospital);
        }
      } else {
        finalData = hospitalList;
      }

      return _.pluck(finalData, 'dutyName');
    } catch (e) {
      return null;
    }
  }


  getRandomPage(totalCount, numPerPage) {
    const startPageNum = 1;
    const lastPageNum = Math.ceil(totalCount / numPerPage);
    return Math.floor(Math.random() * lastPageNum) + startPageNum;
  }


  async getHolidays(connection, year) {
    const query = 'select * from holidays where year = ? ;';
    const [rows] = await connection.query(query, [year]);

    return Promise.resolve(rows);
  }


  async getRandomQuestionByAge(connection, age) {
    const query = 'select * from song_by_age '
      + 'left outer join song on song_by_age.song_idx = song.idx '
      + 'where age_code = ? order by rand() limit 1; ';

    const [rows] = await connection.query(query, [age]);

    return Promise.resolve({
      lyrics: rows[0].lyrics,
      title: rows[0].title,
      singer: rows[0].singer,
    });
  }
}

class NPKResponse {
  constructor() {
    console.log('\nNPKResponse constructor');

    this.version = '2.0';
    this.resultCode = 'OK';
    this.output = {};
    this.directives = [];
  }

  setOutputParameters(obj) {
    this.output = obj;
  }

  addDirective(directive) {
    this.directives.push(directive);
  }
}

const nuguReq = async function (httpReq, httpRes, next) {
  const npkResponse = new NPKResponse();
  const npkRequest = new NPKRequest(httpReq);
  await npkRequest.do(npkResponse);
  console.log(`\nNPKResponse: ${JSON.stringify(npkResponse)}`);
  return httpRes.send(npkResponse);
};

module.exports = nuguReq;
