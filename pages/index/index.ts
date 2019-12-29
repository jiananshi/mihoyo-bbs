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
    return request('home/mobileHomeInfo', 'get', { 
      page, 
      num,
      gids: 1
    }, 'static').then(info => {
      list.push(...info.hots);
      info.hots.forEach((hot: any) => {
        hot.imgsCover = hot.imgs && hot.imgs.length && hot.imgs.slice(0, 3);
      });
      const payload = {
        ['post.list']: list,
        ['post.page']: page + 1
      }
      if (page === 1) payload.sliders = info.circles;
      this.setData(payload, () => {
        this.swiper.init();
      });
    });
  },
  onLoad() {
    wx.showNavigationBarLoading({});
    this.swiper = this.selectComponent('#swiper');
    Promise.all([
      request('home/forums', 'get', {}, 'static'),
      request('topic/getRecommendTopicList', 'get', {}, 'static'),
      request('user/Follow/recommendActiveUserList', 'get', { page_size: 10 }, 'community'),
      this.loadList()
    ]).then(([ nav, topics, activeUsers ]) => {
      this.setData({
        ['nav.list']: nav.forumlists,
        activeUsers: activeUsers.list,
        topics: topics.list
      });
    }, console.error).then(() => wx.hideNavigationBarLoading({}));
  },
  onReachBottom() {
    this.loadList();
  },
  changeNav({ currentTarget: { dataset: { nav } } }) {
    this.setData({ ['nav.current']: nav });
  }
});
