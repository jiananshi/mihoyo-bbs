export type APIType = 'community' | 'takumi' | 'static';

const API_URLS = {
  community: 'https://api-community.mihayo.com/community/',
  takumi: 'https://api-takumi.mihayo.com/',
  static: 'https://api-static.mihayo.com/api/community/forum/'
};

interface IData {
  [name: string]: any;
}

export default function(path: String, method: String, data: IData, type: APIType) {
  const url = API_URLS[type] + path.replace(/^\//, '');
  data.gids = 1; // specify hokai gid
  return wx.cloud.callFunction({
    name: 'proxy',
    data: {
      url,
      method,
      data
    }
  }).then(res => JSON.parse(res.result).data);
}
