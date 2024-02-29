import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import configJson from '@/mux.json';

Vue.config.productionTip = false;

Vue.prototype.$configJson = configJson;

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
