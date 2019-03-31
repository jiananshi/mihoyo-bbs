import request from '../../utils/request';

Page({
  data() {
    return {
      sliders: [],
      nav: {
        current: 1,
        list: []
      }
    }
  },
  onLoad() {
    const swiper = this.selectComponent('#swiper');
    Promise.all([
      request('home/forums', 'get', {}, true),
      request('home/mobileHomeInfo', 'get', { page: 1, num: 20 }, true)
    ]).then(([ nav, info ]) => {
      this.setData({ 
        nav: {
          list: nav.forumlists,
          current: 1
        },
        sliders: info.circles 
      });
      swiper.start();
    })
  },
  changeNav({ currentTarget: { dataset: { nav } } }) {
    this.setData({ ['nav.current']: nav });
  }
})