import request from '../../utils/request';

Page({
  data() {
    return {
      topics: []
    }
  },
  onLoad() {
    request('forum/home/forum', 'get', { forum_id: 1 }).then(({ top_posts, topics }) => {
      this.setData({
        topics
      })
    });
  }
});
