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
    }
  }
});
