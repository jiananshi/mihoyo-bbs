import request from '../../utils/request';

Page({
  data() {
    return {
      sliders: []
    }
  },
  onLoad() {
    const swiper = this.selectComponent('#swiper');
    Promise.all([
      request('home/mobileHomeInfo', 'get', { page: 1, num: 20 }, true)
    ]).then(([ info ]) => {
      this.setData({ sliders: info.circles });
      swiper.start();
    })
  }
})