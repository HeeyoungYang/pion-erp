import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import globalDataTableMixin from './mixins/globalDataTableMixin';
import router from './router'
import configJson from '@/mux.json';

Vue.config.productionTip = false;
Vue.mixin(globalDataTableMixin);

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
  render: h => h(App),
  mounted() {
    if (process.env.NODE_ENV === 'production'){
      // 개발자 도구 감지 및 경고 메시지 표시
      !function() {
        function detectDevTool(allow) {
          if (isNaN(+allow)) allow = 100;
          var start = +new Date();
          // eslint-disable-next-line no-debugger
          debugger;
          var end = +new Date();
          if (isNaN(start) || isNaN(end) || end - start > allow) {
            router.push({ name: 'LoginPage' });
          }
        }
  
        if (window.attachEvent) {
          if (document.readyState === 'complete' || document.readyState === 'interactive') {
            detectDevTool();
            window.attachEvent('onresize', detectDevTool);
            window.attachEvent('onmousemove', detectDevTool);
            window.attachEvent('onfocus', detectDevTool);
            window.attachEvent('onblur', detectDevTool);
          } else {
            setTimeout(arguments.callee, 0);
          }
        } else {
          window.addEventListener('load', detectDevTool);
          window.addEventListener('resize', detectDevTool);
          window.addEventListener('mousemove', detectDevTool);
          window.addEventListener('focus', detectDevTool);
          window.addEventListener('blur', detectDevTool);
        }
      }();
  
      // 키보드 단축키 비활성화
      document.addEventListener('keydown', function (e) {
        if (
          e.key === 'F12' || // F12
          (e.ctrlKey && e.shiftKey && e.key === 'I') || // Ctrl+Shift+I
          (e.ctrlKey && e.shiftKey && e.key === 'C') || // Ctrl+Shift+C
          (e.ctrlKey && e.key === 'U') // Ctrl+U
        ) {
          e.preventDefault();
          // alert('이 키 조합은 비활성화되어 있습니다.');
          return false;
        }
      });
  
      // // 우클릭 메뉴 비활성화
      // document.addEventListener('contextmenu', function (e) {
      //   e.preventDefault();
      //   alert('우클릭은 비활성화되어 있습니다.');
      // });
    }
  }
}).$mount('#app')
