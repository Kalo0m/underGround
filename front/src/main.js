import Vue from "vue";

import App from "./App.vue";
import VueSocketIO from "vue-socket.io";
import SocketIO from "socket.io-client";

Vue.use(
  new VueSocketIO({
    debug: true,
    connection: SocketIO("http://localhost:4000"), //options object is Optional
  })
);
Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount("#app");
