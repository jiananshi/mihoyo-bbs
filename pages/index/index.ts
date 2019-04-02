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
      listCopy: [],
      page: 1,
      num: 20
    },
    topics: []
  },
  onLoad() {
    const swiper = this.selectComponent('#swiper');
    const { page, num, list } = this.data.post;
    Promise.all([
      request('home/forums', 'get', {}, true),
      request('home/mobileHomeInfo', 'get', { page: 1, num: 20 }, true),
      request('topic/getRecommendTopicList', 'get', {}, true)
    ]).then(([ nav, info, topics ]) => {
      list.push(...info.hots);
      info.hots.forEach(hot => {
        hot.imgsCover = hot.imgs && hot.imgs.length && hot.imgs.slice(0, 3);
      });
      this.setData({ 
        ['nav.list']: nav.forumlists,
        sliders: info.circles,
        post: {
          list,
          listCopy: list.slice(2),
          page: page + 1,
          num
        },
        topics: topics.list
      });
      swiper.start();
    })
  },
  changeNav({ currentTarget: { dataset: { nav } } }) {
    this.setData({ ['nav.current']: nav });
  }
});
