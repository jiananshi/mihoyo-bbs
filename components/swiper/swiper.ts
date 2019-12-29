const SWIPER_IMAGE_MARGIN = 5;
const SWIPER_IMAGE_EDGE_SHOWAREA = 20;

const swiperStates = {
  timer: 0, // swiper infinite swipe timer
  imageWidth: 0, // swiper image width
  sliderWidth: 0,
  initialOffset: 0, // user first start swipe image offset
  intialX: 0, // user first start touch x point
  currentX: 0 // user end touching x point
};

Component({
  externalClasses: ['custom-class'],
  properties: {
    images: {
      type: Array,
      value: []
    },
    srcProp: {
      type: String,
      value: 'src'
    },
    keyProp: {
      type: String,
      value: null
    },
    duration: { // control delay time for swiper image
      type: Number,
      value: 2000
    }
  },
  data: {
    current: 0, // current active index of slider 
    hasReachBoundary: false,
    sliderOffset: 0,
    isHidden: true // show swiper when images are ready
  },
  methods: {
    init() {
      wx.getSystemInfo({
        success: ({ screenWidth }) => {
          const imageWidth = screenWidth * .9;
          const sliderWidth = -imageWidth + SWIPER_IMAGE_EDGE_SHOWAREA;
          swiperStates.imageWidth = imageWidth; // slider image width is 90%
          swiperStates.sliderWidth = sliderWidth;
          this.setData({ 
            isHidden: false,
            sliderOffset: sliderWidth
          }); 
          this.start();
        }
      });
    },
    stop() {
      clearInterval(swiperStates.timer);
    },
    start(leading: boolean = false) {
      if (leading) this.swipe();
      swiperStates.timer = setInterval(() => this.swipe(), this.data.duration);
    },
    viewPost({ currentTarget: { dataset: { path } } }) {
      wx.navigateTo({
        url: `../post/post?id=${path.match(/(\d+)$/)[0]}`
      });
    },
    onTouch({ touches }) {
      this.stop();
      const { pageX } = touches[0];
      swiperStates.initialOffset = this.data.sliderOffset;
      swiperStates.intialX = swiperStates.currentX = pageX;
    },
    onTouchMove({ touches }) {
      const { pageX } = touches[0]; 
      const { currentX } = swiperStates;
      const movement = pageX - currentX;
      const sliderOffset = this.data.sliderOffset - (movement < 0 ? -movement : -movement);
      swiperStates.currentX = pageX;
      this.setData({ sliderOffset });
    },
    onTouchEnd() {
      const { intialX, currentX, initialOffset } = swiperStates;
      const movement = currentX - intialX;
      const direction = movement < 0 ? 'right' : 'left'; // user scroll direction is opposite with swipe direction
      if (Math.abs(movement) > swiperStates.imageWidth * .5) {
        if (direction == 'right') {
          this.start(true);
        } else {
          this.swipe('left');
          this.start();
        }
      } else {
        this.setData({ sliderOffset: initialOffset }); // bounce back to original position
      }
    },
    swipe(direction: string = 'right') {
      const { current } = this.data;
      const { sliderWidth } = swiperStates;
      const next = direction === 'right'
        ? current + 1
        : current - 1;
      const offset = direction === 'right'
        ? sliderWidth + (next - 1) * SWIPER_IMAGE_MARGIN + next * (sliderWidth - SWIPER_IMAGE_EDGE_SHOWAREA)
        : sliderWidth + (next === -1 
            ? (-sliderWidth - SWIPER_IMAGE_EDGE_SHOWAREA)
            : next * (sliderWidth - SWIPER_IMAGE_EDGE_SHOWAREA));
      this.setData({
        sliderOffset: offset,
        current: next,
        hasReachBoundary: false
      }, () => {
        if (direction === 'right' && next !== this.data.images.length) return;
        if (direction === 'left' && next !== -1) return;
        setTimeout(() => {
          const y = direction === 'right'
            ? sliderWidth
            : sliderWidth + (this.data.images.length - 1) * (sliderWidth - SWIPER_IMAGE_EDGE_SHOWAREA);
          this.setData({
            sliderOffset: y,
            current: direction === 'right' ? 0 : this.data.images.length - 1,
            hasReachBoundary: true
          });
        }, 100);
      });
    }
  }
})
