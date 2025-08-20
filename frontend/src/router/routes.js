// src/router/routes.js
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import SignUpView from '../views/SignUpView.vue';
import MyPageView from '../views/MyPageView.vue';
import store from '../store/auth.js';
import Idea from '../views/Idea.vue';

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/signup', name: 'signup', component: SignUpView },

  {
    path: '/mypage',
    name: 'mypage',
    component: MyPageView,
    meta: { requiresAuth: true }, // 로그인 필요
  },

  { path: '/Idea', name: 'IdeaPost', component: Idea },

  {
    path: '/idea/:id',
    name: 'IdeaRead',
    component: () => import('@/views/IdeaReadView.vue'),
  },

  {
    path: '/profile-edit',
    name: 'ProfileEdit',
    component: () => import('@/views/ProfileEditView.vue'),
    meta: { requiresAuth: true }, // 로그인 필요
  },

  {
    path: '/admin',
    name: 'admin-dashboard',
    component: () => import('@/views/AdminDashboard.vue'),
    meta: { requiresAdmin: true }, // ✅ 관리자만 접근
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// 전역 가드
router.beforeEach((to, from, next) => {
  const isLoggedIn = store?.getters?.isLoggedIn;

  // 1) 인증 필요한 라우트
  if (to.meta?.requiresAuth && !isLoggedIn) {
    alert('로그인이 필요합니다.');
    return next('/login');
  }

  // 2) 관리자 전용 라우트
  if (to.meta?.requiresAdmin) {
    // 로그인 안 되어 있으면 우선 로그인 요구
    if (!isLoggedIn) {
      alert('로그인이 필요합니다.');
      return next('/login');
    }

    // 스토어에서 역할 가져오기 (사용 중인 구조에 맞춰 아래 우선순위로 안전하게 조회)
    const user = store?.getters?.currentUser || null;

    if (user.role !== 'admin') {
      alert('관리자만 접근할 수 있습니다.');
      return next('/mypage'); // 홈으로 돌려보냄(원하면 /mypage 등으로 변경)
    }
  }

  next();
});

export default router;
