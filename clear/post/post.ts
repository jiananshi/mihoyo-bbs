import request from '../../utils/request';

Page({
  data() {
    return {
      post: {}
    };
  },
  onLoad({ id }) {
    request('Post/mobilePostInfo', 'get', { post_id: id, read: 1 }).then(post => {
      this.setData({ post });
    })
  }
});
