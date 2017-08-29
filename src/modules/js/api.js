let url = {
  hotLists: '/index/hotLists',
  banner: '/index/banner',
  topLists: '/category/topList',
  subList: '/category/subList',
  rank: '/category/rank',
  search: '/search/list',
  goodsDetail: '/goods/details',
  deal: '/goods/deal',
  add: '/cart/add'
}
let host = 'http://rapapi.org/mockjsdata/24170'

for (let key in url){
  if(url.hasOwnProperty(key)){
    url[key] = host + url[key]
  }
}

export default url
