const cloud = require('wx-server-sdk');
const req = require('request-promise');

cloud.init();

exports.main = async (event, context) => {
  const { url, method, data } = event;
  let result;
  try {
    result = await req({
      uri: url,
      method: method.toUpperCase(),
      [method === 'get' ? 'qs' : 'body']: data,
      headers: {
        'Content-Type': 'application/json',
        referer: 'https://m.bbs.mihoyo.com/bh3'
      }
    });
  } catch (e) {
    return e;
  }
};