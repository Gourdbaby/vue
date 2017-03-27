require('./style.scss')
import main from './components/index.vue';
//import 'element-ui/lib/theme-default/index.css'
Vue.use(ElementUI)

$(function(){
  var app = new Vue({
    el: "#app",
    render: function(createElement){
      return createElement(main)
    }
  });
});