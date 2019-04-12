const API_URL = [
  'https://api-static.mihoyo.com/api/community/forum/',
  'https://mihoyo.shijianan.com/community/'
];

export default function(path: String, method: String, data: Object, isFresh = false) {
  const url = API_URL[isFresh ? 0 : 1] + path.replace(/^\//, '');
  return wx.cloud.callFunction({
    name: 'proxy',
    data: {
      url,
      method,
      data
    }
  }).then(res => JSON.parse(res.result).data);
}
