class NPKRequest {
  constructor(httpReq) {
    this.context = httpReq.body.context;
    this.action = httpReq.body.action;
    console.log(`\nNPKRequest: ${JSON.stringify(this.context)}, ${JSON.stringify(this.action)}`);
  }

  do(npkResponse) {
    this.actionRequest(npkResponse);
  }

  actionRequest(npkResponse) {
    console.log('\nactionRequest');
    console.dir(this.action);

    const { actionName } = this.action;
    const { parameters } = this.action;

    switch (actionName) {
      case 'testQuiz':
        npkResponse.setOutputParameters({
          testCode: '헬로',
        });
        break;
      case 'singQuiz':
        npkResponse.setOutputParameters({
          quizLyricsNugu: `나이가 ${parameters.userAge.value}이시군요! 제뉴어리 페뷰러리 마치 짝짝짝 에이프럴 메이 준 짝짝짝 줄라이 어거스트 셉템벌 악토벌 노벰벌 디쎔벌`,
          quizTitleNugu: '먼쓰 쏭',
        });
        break;
      case 'answerResultTrueFalse':
        console.log(`사용자의 대답: ${parameters.lyricAnswer.value}`);
        npkResponse.setOutputParameters({
          resultCode: 'true',
        });
        break;
      default:
        break;
    }
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
}

const nuguReq = function (httpReq, httpRes, next) {
  const npkResponse = new NPKResponse();
  const npkRequest = new NPKRequest(httpReq);
  npkRequest.do(npkResponse);
  console.log(`\nNPKResponse: ${JSON.stringify(npkResponse)}`);
  return httpRes.send(npkResponse);
};

module.exports = nuguReq;
