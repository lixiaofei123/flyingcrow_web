import 'core-js/stable'
import Vue from 'vue'
import App from './App'
import router from './router'
import CoreuiVue from '@coreui/vue'
import { iconsSet as icons } from './assets/icons/icons.js'
import store from './store'
import { Upload,Input,Notification,MessageBox,Progress,Drawer,Autocomplete,Slider,ColorPicker } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios';
import VueClipboard from 'vue-clipboard2'


Vue.config.performance = true
Vue.use(CoreuiVue)


Vue.prototype.$log = console.log.bind(console)
Vue.use(axios)

Vue.use(Upload);
Vue.use(Input);
Vue.use(Drawer);
Vue.use(Progress);
Vue.use(Autocomplete);
Vue.use(Slider)
Vue.use(ColorPicker)
Vue.prototype.$notify = Notification;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;

VueClipboard.config.autoSetContainer = true
Vue.use(VueClipboard)


new Vue({
  el: '#app',
  router,
  store,
  icons,
  template: '<App/>',
  components: {
    App
  }
})
