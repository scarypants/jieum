<template>
  <div id="app" class="d-flex flex-column min-vh-100">
    <header class="app-header">
      <router-link to="/" class="logo-link">
        <img alt="jieum_logo" src="./assets/logo.png" class="logo-image">
      </router-link>

      <!-- ✅ 메인(Home)에서만 보이는 검색창 -->
      <div class="search-bar" v-if="isHome">
        <input v-model="search" @keyup.enter="goSearch" type="search" placeholder="검색..." class="form-control search-input">
      </div>

      <div class="auth-buttons">
        <template v-if="!isLoggedIn">
          <button class="btn btn-outline-primary me-2 auth-btn" @click="goToLogin">로그인</button>
          <button class="btn btn-primary auth-btn" @click="goToSignUp">회원가입</button>
        </template>
        <template v-else>
          <button class="btn btn-outline-primary me-2 auth-btn" @click="goToMyPage">마이페이지</button>
          <button class="btn btn-primary auth-btn" @click="handleLogout">로그아웃</button>
        </template>
      </div>
    </header>

    <!-- ✅ 페이지 콘텐츠 영역 -->
    <main class="app-main-content flex-grow-1">
      <router-view />
    </main>

    <AppFooter />
  </div>
</template>

<script>
import AppFooter from './components/Footer.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'App',
  components: { AppFooter },
  data() {
    return { search: "" }
  },
  computed: {
    ...mapGetters(['isLoggedIn']),
    // ✅ 현재 라우트가 Home인지 체크
    isHome() {
      return this.$route?.name === 'home'; // routes.js에서 home 라우트 name이 'home'인 경우
      // 혹은 경로로도 가능: return this.$route?.path === '/';
    }
  },
  methods: {
    ...mapActions(['logout']),
    goToLogin() { this.$router.push('/login'); },
    goToSignUp() { this.$router.push('/signup'); },
    goToMyPage() { this.$router.push('/mypage'); },
    handleLogout() {
      this.logout();
      if (this.$route.path !== '/') this.$router.push('/');
      alert('로그아웃 되었습니다.');
    },
    goSearch() {
      this.$router.push({ 
        name: "home", 
        query: { search: this.search } 
      })
      this.search = ""
    }
  }
}
</script>

<style>
/* App.vue의 기본 스타일 및 헤더 스타일 */
#app {
  font-family: 'Arial', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 40px;
  background-color: white;
  border-bottom: 1px solid white;
}

.logo-link { text-decoration: none; color: inherit; }

.logo-image {
  height: 70px;
  cursor: pointer;
  margin-right: 30px;
}

/* 검색창 스타일 */
.search-bar {
  flex-grow: 1;
  max-width: 500px;
  margin: 0 30px;
  border-color: #3C096C;
}
.search-input {
  border-radius: 20px;
  border: 2px solid #3C096C;
  padding: 8px 15px;
  width: 100%;
}
.search-input::placeholder { color: #3C096C; }
.search-input:focus {
  border-color: #3C096C;
  box-shadow: 0 0 0 0.2rem rgba(123, 44, 191, 0.25);
}

.auth-buttons { display: flex; align-items: center; }
.auth-btn {
  padding: 8px 15px;
  border-radius: 20px;
  font-weight: bold;
  transition: all 0.2s ease;
}
.auth-buttons .btn-outline-primary {
  color: #3C096C;
  border-color: #3C096C;
  background-color: transparent;
}
.auth-buttons .btn-outline-primary:hover {
  background-color: #3C096C;
  color: white;
}
.auth-buttons .btn-primary {
  background-color: #3C096C;
  border-color: #3C096C;
  color: white;
}
.auth-buttons .btn-primary:hover {
  background-color: transparent;
  border-color: #3C096C;
  color: #3C096C;
}

.app-main-content { padding: 20px; }
</style>
