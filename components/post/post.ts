Component({
  properties: {
    post: {
      type: Object,
      value: {}
    }
  },
  methods: {
    viewPost() {
      wx.navigateTo({
        url: `../post/post?id=${this.data.post.post_id}`
      });
    },
    viewImage({ currentTarget: { dataset: { imgs, current } } }) {
      wx.previewImage({
        current: imgs[current],
        urls: imgs,
      })
    }
  }
});
