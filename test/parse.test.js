const parser = require('fast-xml-parser');
const request = require('request-promise-native');
const qs = require('querystring');

describe('module test', () => {
  it('xml parsing', async () => {
    const url = 'http://apis.data.go.kr/B552657/HsptlAsembySearchService/getHsptlMdcncListInfoInqire?';
    const serviceKey = 'p%2BUqp%2BEgDAVoFs46fE2t6wh9i0oaQQQEfUgE%2FIoPDjFs3lkiBWay3eYPV6FOHiCYFC3zjuSslHQx6Lfi6o3KdA%3D%3D';
    const queryObj = qs.escape({
      ServiceKey: serviceKey,
    });
    console.log(url + queryObj);
    const result = await request({
      method: 'GET',
      url: `${url}ServiceKey=${serviceKey}`,
    });

    console.log(typeof result);
    console.log(result);

    var options = {
      attributeNamePrefix : "@_",
      attrNodeName: "attr", //default is 'false'
      textNodeName : "#text",
      ignoreAttributes : true,
      ignoreNameSpace : false,
      allowBooleanAttributes : false,
      parseNodeValue : true,
      parseAttributeValue : false,
      trimValues: true,
      cdataTagName: "__cdata", //default is 'false'
      cdataPositionChar: "\\c",
      localeRange: "", //To support non english character in tag/attribute values.
      parseTrueNumberOnly: false,
    };

    if (parser.validate(result) === true) {
      const jsonObj = parser.parse(result);
      console.log(jsonObj);
    }
  }).timeout(20000);
});
