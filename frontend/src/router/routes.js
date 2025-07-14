import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import SignUpView from '../views/SignUpView.vue';
import MyPageView from '../views/MyPageView.vue'; // MyPageView 컴포넌트 임포트 
import store from '../store/auth.js'; //  Vuex 스토어 임포트(라우터 가드에서 사용)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignUpView,
  },
  {
    path: '/mypage', //  마이페이지 경로 
    name: 'mypage',
    component: MyPageView,
    meta: { requiresAuth: true } //  인증이 필요한 라우트임을 표시 
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

//  라우터 가드 추가(전역 네비게이션 가드) : 각 라우트로 이동하기 전에 실행 
router.beforeEach((to, from, next) => { 
// 라우트 메타 필드에 'requiresAuth: true'가 설정되어 있고
  // Vuex 스토어의 isLoggedIn 상태가 false (로그인되지 않음)인 경우  
  if (to.meta.requiresAuth && !store.getters.isLoggedIn) {
    // 인증이 필요하고 로그인되어 있지 않으면 로그인 페이지로 리다이렉트
    alert('로그인이 필요합니다.'); //사용자에게 알림
    next('/login'); // 로그인 페이지로 리다이렉트
  } else {
    next(); // 다음으로 진행
  }
});

export default router;