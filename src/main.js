import { createApp } from 'vue'
import App from './App.vue'
import 'virtual:svg-icons-register'
import SvgIcon from '@/components/SvgIcon/index.vue'
import ElementPlus from 'element-plus'
import * as ELIcons from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import router from './router'
import './assets/styles/base.css'
import './assets/styles/box.css'
import './assets/styles/layout.css'
 
const app = createApp(App)
app.component('svg-icon',SvgIcon)
for (let  iconName in ELIcons) {
    app.component(iconName,ELIcons[iconName]) 
}
app.use(ElementPlus)
app.use(router)
app.mount('#app')



