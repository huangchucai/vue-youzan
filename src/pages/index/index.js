import 'css/common.css'
import './index.css'

import Vue from 'vue'
import url from 'js/api.js'
import axios from 'axios'
import foot from 'components/Foo.vue'
import swiper from 'components/Swiper.vue'
import { InfiniteScroll } from 'mint-ui'
Vue.use(InfiniteScroll)

new Vue({
  el: '.vue-el',
  data() {
    return {
      pageNum :1,
      pageSize: 6,
      lists: null,
      loading: false,
      allLoaded: false,
      bannerLists: null
    }
  },
  created() {
    this.getLists(),
    this.getBanner()
  },
  methods: {
    getLists() {
      // 不会触发无限滚动
      this.loading = true;
      if(this.allLoaded) return
      axios.post(url.hotLists,{
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }).then((res) => {
        let curLists = res.data.lists
        // 当返回的数据的长度小于我们请求的一页长度，证明没有了
        if(curLists.length < this.pageSize) {
          this.allLoaded = true
        }
        if(this.lists){
          this.lists = this.lists.concat(curLists);
        }else{
          this.lists = curLists;
        }
        this.loading = false;
      })
    },
    getBanner() {
      axios.get(url.banner).then((res) => {
        this.bannerLists = res.data.lists || [];     
      })
    }
  },
  components: {
    foot,
    swiper
  }
})
