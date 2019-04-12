import request from '../../utils/request';
import { parseToNodes } from '../../utils/parser';

Page({
  data() {
    return {
      post: {},
      comments: []
    };
  },
  onLoad({ id }) {
    Promise.all([
      request('forum/Post/mobilePostInfo', 'get', { post_id: id, read: 1 }),
      request('forum/Reply/mobileReplyList', 'get', { post_id: id, order: 1, num: 20, landlord: 0 })
    ])
    .then(([ post, comments ]) => {
      post.content = parseToNodes(post.content);
      comments.list.forEach(comment => comment.content = parseToNodes(comment.content));

      this.setData({ post, comments: comments.list });
    })
  }
});
