import 'css/common.css'
import './search.css'

import Vue from 'vue'
import axios from 'axios'
import url from 'js/api.js'
import mixin from 'js/mixin.js'
import animate from 'velocity-animate'
import qs from 'qs';
const {keyword,id} = qs.parse(location.search.substring(1))
new Vue({
  el:'.container',
  data() {
    return {
      searchList: null,
      keyword,
      show:false
    }
  },
  created() {
    this.getSearchList()
    console.log(this)
  },
  methods: {
     getSearchList() {
      axios.post(url.search,{keyword,id}).then(res => {
        this.searchList = res.data.lists;
      })
    },
    move() {
      if(document.body.scrollTop > 100) {
        this.show = true;
      } else {
        this.show = false;
      }
    },
    // listenerMove() {
    //   this.$refs.container.addEventListener('scroll', () => {
    //     console.log(document.body.scrollTop)
    //   })
    // },
    toTop() {
      Velocity(document.body, 'scroll', {
        duration: 1000,
        complete: () => {
          this.move()
        }
      });
    }
  },
  mixins: [mixin]
})
