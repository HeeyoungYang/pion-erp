import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import configJson from '@/mux.json';

Vue.config.productionTip = false;

Vue.prototype.$configJson = configJson;

if (process.env.NODE_ENV === 'production') {
  // 배포 모드에서 콘솔 로그 제거
  Vue.config.silent = true;
  console.log = function() {};
  console.info = function() {};
  console.warn = function() {};
  console.error = function() {};
}

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
