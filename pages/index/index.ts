import request from '../../utils/request';

Page({
  data: {
    sliders: [],
    nav: {
      current: 1,
      list: []
    },
    post: {
      list: [],
      page: 1,
      num: 20
    },
    topics: [],
    activeUsers: []
  },
  loadList() {
    const { list, page, num } = this.data.post;
    return request('home/mobileHomeInfo', 'get', { page, num }, true).then(info => {
      list.push(...info.hots);
      info.hots.forEach(hot => {
        hot.imgsCover = hot.imgs && hot.imgs.length && hot.imgs.slice(0, 3);
      });
      const payload = {
        ['post.list']: list,
        ['post.page']: page + 1,
      }
      if (page === 1) payload.sliders = info.circles;
      this.setData(payload);
    });
  },
  onLoad() {
    wx.showNavigationBarLoading();
    const swiper = this.selectComponent('#swiper');
    Promise.all([
      request('home/forums', 'get', {}, true),
      request('topic/getRecommendTopicList', 'get', {}, true),
      request('user/Follow/recommendActiveUserList', 'get', { page_size: 10 })
      this.loadList()
    ]).then(([ nav, topics, activeUsers ]) => {
      this.setData({
        ['nav.list']: nav.forumlists,
        activeUsers: activeUsers.list,
        topics: topics.list
      });
      swiper.start();
    }, console.error).then(() => wx.hideNavigationBarLoading());
  },
  onReachBottom() {
    this.loadList();
  },
  changeNav({ currentTarget: { dataset: { nav } } }) {
    this.setData({ ['nav.current']: nav });
  }
});
