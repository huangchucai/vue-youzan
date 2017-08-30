import './cart.css'
import './cart_trade.css'
import './cart_base.css'

import url from 'js/api.js'
import Vue from 'vue'
import axios from 'axios'
import mixin from 'js/mixin.js'

new Vue({
  el: '#app-cart',
  data(){
    return {
      cartDetail: null,
      isShow: false,
      goodsChecked:false,
      allChecked: false,
      editingShop: null,  //正在编辑的商铺
      editingShopIndex: -1
    }
  },
  created(){
    this.getCartDetail()
  },
  methods: {
    getCartDetail(){
      axios.get(url.cart).then((res) => {
        const lists = res.data.cartList;
        lists.forEach(list => {
          list.checked = false
          list.editing = false
          list.removeChecked = false
          list.editingMsg = '编辑'
          list.goodsList.forEach((good) => {
            good.checked = false
          })
        })
        this.cartDetail = lists
      })
    },
    // 商品选择
    chooseGoods(shop,goods){
      goods.checked = !goods.checked;
      shop.checked = shop.goodsList.every(goods => {
        return goods.checked
      })
    },
    // 商铺选择
    chooseShop(shop){
      shop.checked = !shop.checked
      shop.goodsList.forEach(good => {
        good.checked = shop.checked
      })
    },
    // 全选
    chooseAll(){
      this.allChecked = !this.allChecked
      this.cartDetail.forEach(list => {
        list.checked = !list.checked
        list.goodsList.forEach(goods => {
          goods.checked = !goods.checked
        })
      })
    },
    // 编辑商铺
    editing(shop,shopIndex) {
      shop.editing = !shop.editing
      shop.editingMsg = shop.editing ? '完成' : '编辑'
      this.cartDetail.forEach((list,i) => {
        if(shopIndex !== i){
          list.editing= false
          list.editingMsg = shop.editing ? '' : '编辑'
        }
      })
    }
  },
  mixins: [mixin]
})
