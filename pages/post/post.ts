import request from '../../utils/request';

Page({
  data() {
    return {
      post: {},
      comments: []
    };
  },
  onLoad({ id }) {
    Promise.all([
      request('Post/mobilePostInfo', 'get', { post_id: id, read: 1 }),
      request('Reply/mobileReplyList', 'get', { post_id: id, order: 1, num: 20, landlord: 0 })
    ])
    .then(([ post, comments ]) => {
      this.setData({ post, comments: comments.list });
    })
  }
});
