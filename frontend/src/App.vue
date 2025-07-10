<template>
  <div id="app" class="d-flex flex-column min-vh-100">
    <header class="app-header">
      <router-link to="/" class="logo-link">
        <img alt="jieum_logo" src="./assets/logo.png" class="logo-image">
      </router-link>
      
      <div class="search-bar">
        <input type="search" placeholder="검색..." class="form-control search-input">
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

    <main class="app-main-content flex-grow-1">
      <router-view />
    </main>

    <AppFooter />
  </div>
</template>

<script>
import AppFooter from './components/Footer.vue'; // 푸터 컴포넌트 임포트
import { mapGetters, mapActions } from 'vuex'; // Vuex 헬퍼 임포트

export default {
  name: 'App',
  components: {
    AppFooter,
  },
  computed: {
    // Vuex getter를 사용하여 로그인 상태를 컴포넌트 속성으로 매핑
    ...mapGetters(['isLoggedIn']) 
  },
  methods: {
    // Vuex action을 사용하여 로그아웃 액션을 컴포넌트 메서드로 매핑
    ...mapActions(['logout']), 

    goToLogin() {
      // 로그인 페이지로 이동
      this.$router.push('/login');
    },
    goToSignUp() {
      // 회원가입 페이지로 이동
      this.$router.push('/signup');
    },
    goToMyPage() {
      // 마이페이지로 이동
      this.$router.push('/mypage'); 
    },
    handleLogout() {
      // Vuex logout 액션 호출
      this.logout();
      // 로그아웃 후 홈 페이지로 리다이렉트 (현재 경로가 홈이 아니면)
      if (this.$route.path !== '/') {
        this.$router.push('/');
      }
      alert('로그아웃 되었습니다.');
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
  color: #2c3e50; /* 기본 글자색 */
}

.app-header {
  display: flex; /* 요소들을 가로로 정렬 */
  justify-content: space-between; /* 로고, 검색창, 버튼들을 양 끝으로 분산 */
  align-items: center; /* 세로 중앙 정렬 */
  padding: 10px 40px;
  background-color: white;
  border-bottom: 1px solid white;
}

.logo-link {
  text-decoration: none; /* router-link의 기본 밑줄 제거 */
  color: inherit; /* 부모 요소의 글자색 상속 */
}

.logo-image {
  height: 70px; /* 로고 이미지 크기 조정 */
  cursor: pointer; /* 클릭 가능한 요소임을 나타내는 커서 */
  margin-right: 30px; /* 검색창과의 간격 */
}

/* 검색창 스타일 */
.search-bar {
  flex-grow: 1; /* 검색창이 가능한 많은 공간을 차지하도록 설정 */
  max-width: 500px; /* 검색창 최대 너비 설정 */
  margin: 0 30px; /* 좌우 여백 */
  border-color: #3C096C; /* 테두리 색상 */

}

.search-input {
  border-radius: 20px; /* 둥근 모서리 */
  border: 2px solid #3C096C;  
  padding: 8px 15px;
  width: 100%; /* 부모 너비에 꽉 차게 */
}
.search-input::placeholder { /* 플레이스홀더 스타일 */
  color: #3C096C;
}
.search-input:focus {
  border-color: #3C096C; /* 포커스 시 보라색 테두리 */
  box-shadow: 0 0 0 0.2rem rgba(123, 44, 191, 0.25); /* 포커스 시 그림자 효과 */
}

.auth-buttons {
  display: flex;
  align-items: center;
}

/* 로그인/회원가입 버튼 스타일 */
.auth-btn {
  padding: 8px 15px;
  border-radius: 20px; /* 둥근 모서리 */
  font-weight: bold;
  transition: all 0.2s ease;
}

/* 로그인 버튼 (윤곽선) */
.auth-buttons .btn-outline-primary { /* 부모 클래스를 추가하여 우선순위 높임 */  color: #3C096C; /* 텍스트 색상 */
  border-color: #3C096C; /* 테두리 색상 */
  background-color: transparent; /* 배경 투명 */
}

.auth-buttons .btn-outline-primary:hover {
  background-color: #3C096C; /* 호버 시 배경색 */
  color: white; /* 호버 시 텍스트 색상 */
}

/* 회원가입 버튼 (채워진 색상) */
.auth-buttons .btn-primary {
  background-color: #3C096C; /* 배경색 투명 */
  border-color: #3C096C; /* 테두리 색상 */
  color: white; /* 텍스트 색상 */
}

.auth-buttons .btn-primary:hover {
  background-color: transparent; /* 호버 시 배경색 */
  border-color: #3C096C; /* 호버 시 테두리 색상 */
  color: #3C096C; /* 텍스트 색상 */

}

.app-main-content {
  padding: 20px;
}
</style>