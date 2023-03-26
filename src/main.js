import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import http from './utils/httpmanager'
import sakura from './store/sakura'
import MouseMove from './store/MouseMove'
import * as echarts from 'echarts';
Vue.prototype.$echarts = echarts


import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' //这个样式必须引入
import VMdEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';

// highlightjs
import hljs from 'highlight.js';

VMdEditor.use(githubTheme, {
    Hljs: hljs,
});
Vue.use(VMdEditor);

//import MouseMove from './store/MouseMove'
import {
    Pagination,
    Input,
    InputNumber,
    Button,
    Table,
    TableColumn,
    Tag,
    Form,
    FormItem,
    Icon,
    Menu,
    CheckboxGroup,
    CheckboxButton,
    Submenu,
    MenuItem,
    MenuItemGroup,
    Row,
    Col,
    Upload,
    Container,
    Header,
    Aside,
    DatePicker,
    Main,
    Footer,
    Image,
    Avatar,
    Popover,
    Loading,
    Link,
    Alert,
    Scrollbar,
    Radio,
    Divider,
    Drawer,
    Message,
    Dialog,
    Select,
    Option,
    Switch,
    scrollbar,
    Notification
} from 'element-ui';
Vue.use(Pagination);
Vue.use(Input);
Vue.use(InputNumber);
Vue.use(Button);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Tag);
Vue.use(Link);
Vue.use(Alert);
Vue.use(Scrollbar);
Vue.use(Radio);
Vue.use(Divider);
Vue.use(Drawer);
Vue.use(DatePicker);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Icon);
Vue.use(Menu);
Vue.use(CheckboxGroup);
Vue.use(CheckboxButton);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);
Vue.use(scrollbar);
Vue.use(Container);
Vue.use(Upload);
Vue.use(Row);
Vue.use(Col);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Footer);
Vue.use(Image);
Vue.use(Avatar);
Vue.use(Popover);
Vue.use(Loading.directive);
Vue.use(Dialog)
Vue.use(Select)
Vue.use(Option)
Vue.use(Switch)
Vue.use(sakura)
 Vue.use(MouseMove)


Vue.prototype.$loading = Loading.service;
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;

Vue.prototype.$get = http.get;
Vue.prototype.$post = http.post;
Vue.config.productionTip = false
http.defaults.baseURL = process.env.VUE_APP_URL;

NProgress.inc(0.2)
NProgress.configure({ easing: 'ease', speed: 500, showSpinner: false })
router.beforeEach((to, from, next) => {
    NProgress.start()
    if (to.meta.title) {
        document.title = to.meta.title
    }
    next()
    const route = document.getElementsByClassName('route-content')[0]
    if (route) {
        route.classList.remove('route-filter')
    }
})

router.afterEach(() => {
    NProgress.done()
})

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')