// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router/routes';
import store from './store/auth.js';

// Bootstrap CSS 및 JS 임포트 (경로 확인)
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// 사용자 정의 CSS 임포트 (경로 확인)
import './assets/main.css'; // ⭐ 이 줄만 있어야 합니다. ⭐

const app = createApp(App);

app.use(router);
app.use(store);

app.mount('#app');
store.dispatch('initializeLoginStatus');