import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
const {filters} = require('./utils');

import '@/assets/css/reset.css';

Vue.config.productionTip = false;
for(let key in filters){
	Vue.filter(key, filters[key]);
}
new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
