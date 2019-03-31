let screenY: number;
let timer: number;

Component({
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
    duration: {
      type: Number,
      value: 2000
    }
  },
  data: {
    current: 0, // current active index of slider 
    hasReachBoundary: false,
    sliderOffset: 0
  },
  methods: {
    start() {
      wx.getSystemInfo({
        success: ({ screenWidth }) => {
          screenY = screenWidth * .9; // slider image width is 90%
          this.setData({ sliderOffset: -screenY - 5 + 20 });
          timer = setInterval(() => {
            const { current } = this.data;
            const next = current + 1;
            this.setData({
              sliderOffset: -screenY * (next + 1) - 5 * (next + 1) + 20,
              current: next,
              hasReachBoundary: false
            }, () => {
              if (next !== this.data.images.length) return;
              setTimeout(() => {
                this.setData({
                  sliderOffset: -screenY - 5 + 20,
                  current: 0,
                  hasReachBoundary: true
                });
              }, 100);
            });
          }, this.data.duration);
        }
      });
    }
  }
})
