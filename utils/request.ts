const API_URL = [
  'https://bbs.mihoyo.com/api/community/forum/',
  'https://api-community.mihoyo.com/community/'
];

export default function(path: String, method: String, data: Object, isFresh = false) {
  const url = API_URL[isFresh ? 0 : 1] + path.replace(/^\//, '');
  return new Promise((resolve, reject) => {
    const payload = wx.request({
      url,
      method,
      data,
      header: {
        'content-type': 'application/json'
      },
      success: res => resolve(res.data.data),
      fail: reject
    });
    return payload;
  });
}
