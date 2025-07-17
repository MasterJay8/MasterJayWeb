import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style/style.css'
import './style/reset.css'
//import './style.css'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../src/views/Home.vue'

const routes = [
    { path: '/', name: "home", component: Home },
    { path: '/klikacka', name: "klikacka", component: () => import('../src/views/Klikacka.vue') },
    { path: '/albionmarketprice', name: "albionmarketprice", component: () => import('../src/views/AlbionMarketPrice.vue') }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})


const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
