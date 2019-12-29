import request from '../../utils/request';
import { parseToNodes } from '../../utils/parser';

interface routerParams {
  id: string;
}

function formatDate(raw: string): string {
  return (new Date(raw)).toLocaleDateString().replace(/\//g, '-');
}

Page({
  data: {
    post: {},
    comments: [],
    commentParams: {
      order: 1,
      num: 20,
      floor_id: 0,
      landlord: 0
    }
  },
  onLoad(params: routerParams): void {
    wx.showNavigationBarLoading({});
    const { id } = params;
    this.id = id;
    Promise.all([
      request('post/wapi/getPostFull', 'get', { post_id: id }, 'takumi'),
      this.loadComments()
    ])
    .then(([post]) => {
      post = post.post.post;
      // post.content = parseToNodes(post.content);
      post.created_at = formatDate(post.created_at);
      this.setData({ post });
    }, console.error)
    .then(() => wx.hideNavigationBarLoading({}));
  },
  loadComments() {
    const { num, floor_id } = this.data.commentParams;
    return request('post/wapi/hotReplyList', 'get', Object.assign({ 
      post_id: this.id
    }, this.data.commentParams), 'takumi').then(comments => {
      // comments.list.forEach(comment => comment.content = parseToNodes(comment.content));
      this.setData({ 
        ['commentParams.floor_id']: floor_id + num,
        comments: [...this.data.comments, ...comments.list]
      });
      return comments.list;
    });
  },
  onReachBottom() {
    this.loadComments();
  }
});
