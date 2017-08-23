const mixin = {
  filters: {
    money(val) {
      if(typeof val === 'number') {
        return val.toFixed(2);
      }
    }
  }
}
export default mixin
