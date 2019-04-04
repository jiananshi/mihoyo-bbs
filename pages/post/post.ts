import request from '../../utils/request';

Page({
  onLoad({ id }) {
    request('Post/mobilePostInfo', 'get', { post_id: id, read: 1 }).then(console.log);
  }
});
