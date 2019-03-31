const uuid = require('uuid').v4;
const mysql = require('mysql2/promise');

const HELP_FILE_PATH = 'http://ssunno.iptime.org:3000/hls/help.m3u8';

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

    let result;
    switch (actionName) {
      case 'mealSelection':
        result = await this.getMealData(conn, parameters.mealType.value);
        npkResponse.setOutputParameters({ mealResult: result });
        break;
      default:
        break;
    }
  }

  async getMealData(connection, mealType) {
    const curDate = new Date();
    const query = 'select * from song_by_age '
      + 'left outer join song on song_by_age.song_idx = song.idx '
      + 'where age_code = ? order by rand() limit 1; ';
    console.log(query);
    console.log(age);
    const [rows] = await connection.query(query, [age]);

    connection.release();

    return Promise.resolve({
      lyrics: rows[0].lyrics,
      title: rows[0].title,
      singer: rows[0].singer,
    });
  }
  async getRandomQuestionByAge(connection, age) {
    const query = 'select * from song_by_age '
      + 'left outer join song on song_by_age.song_idx = song.idx '
      + 'where age_code = ? order by rand() limit 1; ';
    console.log(query);
    console.log(age);
    const [rows] = await connection.query(query, [age]);

    connection.release();

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
