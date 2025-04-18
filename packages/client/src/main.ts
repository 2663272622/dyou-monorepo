import { createApp } from "vue";
import { store } from "./store";
// normalize.css
import "normalize.css/normalize.css";
// 全局样式
import "./styles/index.less";
// tailwindcss
import "./styles/tailwind.css";
// svg icon
import "virtual:svg-icons-register";
import { initializeDarkMode } from "@/utils/dark-mode";
import App from "./App.vue";
import router from "./router";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 全局组件
import navBar from '@/components/c-nav-bar/index.vue'

initializeDarkMode();

const app = createApp(App);
app.component('CNavBar',navBar)
app.use(store);
app.use(router);
app.use(ElementPlus)

app.mount("#app");
