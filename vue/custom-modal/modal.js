import Vue from 'vue'

export default ({ app, store }, inject) => {
  inject('modal', new Vue({
    methods: {
      open(options) {
        return new Promise((resolve, reject) => {

          this.$bus.$emit('modal', options)
          
          let self = this
          setTimeout(function() {
            document.getElementById('resolveModal').onclick = function () { resolve(1) }
            document.getElementById('rejectModal').onclick = function () { reject(2) }
          }, 200);
        })
      }
    }
  }))
}