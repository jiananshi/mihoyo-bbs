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
    }
  },
  onLoad() {
    const swiper = this.selectComponent('#swiper');
    const { page, num, list } = this.data.post;
    Promise.all([
      request('home/forums', 'get', {}, true),
      request('home/mobileHomeInfo', 'get', { page: 1, num: 20 }, true)
    ]).then(([ nav, info ]) => {
      list.push(...info.hots);
      this.setData({ 
        ['nav.list']: nav.forumlists,
        sliders: info.circles,
        post: {
          list,
          page: page + 1,
          num
        }
      });
      swiper.start();
    })
  },
  changeNav({ currentTarget: { dataset: { nav } } }) {
    this.setData({ ['nav.current']: nav });
  }
});
