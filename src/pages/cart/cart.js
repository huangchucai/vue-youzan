import './cart.css'
import './cart_trade.css'
import './cart_base.css'

import url from 'js/api.js'
import Vue from 'vue'
import axios from 'axios'
import mixin from 'js/mixin.js'
import 'mint-ui/lib/style.css'
import { MessageBox } from 'mint-ui';

new Vue({
  el: '#app-cart',
  data(){
    return {
      cartDetail: null,
      isShow: false,
      goodsChecked:false,
      editingShop: null,  //正在编辑的商铺
      editingShopIndex: -1,
      totalMoney: 0,
      removeData: null // 删除单个商品信息
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
          // 商品删除的状态
          list.removeChecked = false
          list.editingMsg = '编辑'
          list.goodsList.forEach((goods) => {
            goods.checked = false
            goods.removeChecked = false
          })
        })
        this.cartDetail = lists
      })
    },
    // 商品选择
    chooseGoods(shop,goods){
      let attr = this.editingShop ? 'removeChecked' : 'checked'
      goods[attr] = !goods[attr];
      shop[attr] = shop.goodsList.every(goods => {
        return goods[attr]
      })
    },
    // 商铺选择
    chooseShop(shop){
      let attr = this.editingShop ? 'removeChecked' : 'checked'
      shop[attr] = !shop[attr]
      shop.goodsList.forEach(goods => {
        goods[attr] = shop[attr]
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
      this.editingShop = shop.editing ? shop : null
      this.editingShopIndex = shop.editing ? shopIndex : -1
    },
    // 全选
    chooseAll() {
      let attr = this.editingShop ? 'allRemoteChecked' : 'allChecked'
      this[attr] = !this[attr]
    },
    // 添加商品
    add(goods) {
      axios.post(url.addNum,{
        id: goods.id,
        number: 1
      }).then((res) => {
        if(res.status === 200) {
          goods.number++
        }
      })
    },
    // 减少商品
    reduce(goods){
      if(goods.number === 1) return
      axios.post(url.reduceNum,{
        id: goods.id,
        number: 1
      }).then((res) => {
        if(res.status === 200) {
          goods.number--
        }
      })
    },
    // 删除单个商品
    remove(shop,shopIndex,goods,goodsIndex) {
      if(this.editingShop) {
        this.removeData = {shop,shopIndex,goods,goodsIndex}
        MessageBox.confirm('确定要删除当前商品吗？').then(() => {
          axios.post(url.remove,{id: goods.id}).then((res) => {
            if(res.status === 200){
              shop.goodsList.splice(goodsIndex,1)
              if(!shop.goodsList.length) {
                this.cartDetail.splice(shopIndex,1)
                this.removeShop()
              }
            }
          }) 
        },() => {
          this.removeShop()
        })
      }
      // console.log(MessageBox)
    },
    // 删除多个商品
    removeList(){
      MessageBox.confirm('确定要删除当前商品吗？').then(() => {
        let ids = []
        this.removeLists.forEach(goods => {
          ids.push(goods.id)
        })
        axios.post(url.removeMore,ids).then((res) => {
          if(res.status === 200) {
            let arr = []
            this.editingShop.goodsList.forEach(goods => {
              // 找到被选中删除的索引
              let index = this.removeLists.findIndex(remove => {
                return  remove.id === goods.id
              })
              if(index === -1) {
                arr.push(goods)
              }
            })
            if(arr.length) {
              this.editingShop.goodsList = arr
            }else {
              this.cartDetail.splice(this.editingShopIndex,1)
              this.removeShop()
            }
          }
        })
       },() =>{
         this.removeShop()
       })
    },
    // 删除商品后回到编辑状态
    removeShop(shop) {
      this.editingShop = null;
      this.shopIndex = -1;
      this.cartDetail.forEach(shop => {
        shop.editing = false  // 把编辑状态设置为false
        shop.editingMsg = '编辑'
      })
    }
  },
  computed: {
    allChecked: {
      get() {
        if(this.cartDetail && this.cartDetail.length){
            return this.cartDetail.every(list => {
              return list.checked
            })
        }
        return false
      },
      set(newVal) {
        this.cartDetail.forEach(list => {
          list.checked = newVal
          list.goodsList.forEach(goods => {
            goods.checked = newVal
          })
        })
      }
    },
    selectLists() {
      if(this.cartDetail && this.cartDetail.length) {
        let arr = []
        let total = 0
        this.cartDetail.forEach(list => {
          list.goodsList.forEach(goods => {
            if(goods.checked) {
              arr.push(goods)
              total+= goods.price  * goods.number
            }
          })
        })
        this.totalMoney = total
        return arr
      }
      return []
    },
    allRemoteChecked: {
      get() {
        if(this.editingShop) {
          return this.editingShop.goodsList.every(goods => {
            return goods.removeChecked
          })
        }
        return false
      },
      set(newVal) {
        this.editingShop.goodsList.forEach(goods => {
          goods.removeChecked = newVal
        })
      }
    },
    removeLists() {
      if(this.editingShop) {
        let arr = []
        this.editingShop.goodsList.forEach(goods => {
          if(goods.removeChecked) {
            arr.push(goods)
          }
        })
        return arr
      }
      return []
    }
  },
  mixins: [mixin]
})
