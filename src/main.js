import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import configJson from '@/mux.json';

Vue.config.productionTip = false;

Vue.prototype.$configJson = configJson;

if (process.env.NODE_ENV === 'production') {
  Vue.config.silent = true;
}

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
