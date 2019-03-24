class NPKRequest {
  constructor(httpReq) {
    this.context = httpReq.body.context;
    this.action = httpReq.body.action;
    console.log(`NPKRequest: ${JSON.stringify(this.context)}, ${JSON.stringify(this.action)}`);
  }

  do(npkResponse) {
    this.actionRequest(npkResponse);
  }

  actionRequest(npkResponse) {
    console.log('actionRequest');
    console.dir(this.action);

    const { actionName } = this.action;
    const { parameters } = this.action;

    switch (actionName) {
      case 'testQuiz':
        npkResponse.setOutputParameters({
          testCode: '헬로',
        });
        break;
      default:
        break;
    }
  }
}

class NPKResponse {
  constructor() {
    console.log('NPKResponse constructor');

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
  console.log(`NPKResponse: ${JSON.stringify(npkResponse)}`);
  return httpRes.send(npkResponse);
};

module.exports = nuguReq;
