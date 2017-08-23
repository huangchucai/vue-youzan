import './category.css'
import 'css/common.css'

import Vue from 'vue'
import axios from 'axios'
import url from 'js/api.js'
import mint from 'mint-ui'
import { Spinner } from 'mint-ui';
Vue.use(mint)

import foot from 'components/Foot.vue'
new Vue({
  el: '#app',
  data() {
    return {
      topLists: null,
      topIndex: 0,
      subLists: null,
      rankLists: null
    }
  },
  created() {
    this.getTopList();
    this.getSubLists(0,0);
  },
  methods: {
    getTopList() {
      axios.post(url.topLists).then(res => {
        this.topLists = res.data.lists
      })
    },
    getSubLists(id,index) {
      this.topIndex = index; //记录当前的index值
      // 区分综合分类和其他分类
      if(index === 0) {
        this.getRankLists()
      } else {
        axios.post(url.subList,{id}).then((res) => {
          this.subLists = res.data.data
        })
      }
    },
    //获取综合分类
    getRankLists() {
      axios.post(url.rank).then((res) => {
        this.rankLists = res.data.data
      })
    },
    // 跳转到搜索页面
    toSearch(item){
      location.href = `search.html?keyword=${item.name}&id=${item.id}`
    }  
  },
  components: {
    foot
  },
  filters: {
    toFixedTwo(num) {
      return num.toFixed(2,10)
    }
  }
}) 
