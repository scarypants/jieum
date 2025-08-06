<template>
  <div class="login-page">
    <div class="login-container">
      <h1 class="login-title">로그인</h1>
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="loginId" class="form-label">아이디</label>
          <input type="text" class="form-control" id="loginId" v-model="loginId" required>
        </div>
        <div class="form-group">
          <label for="loginPassword" class="form-label">비밀번호</label>
          <input type="password" class="form-control" id="loginPassword" v-model="loginPassword" required>
        </div>
        <button type="submit" class="btn login-btn">
          로그인
        </button>
        <p v-if="errorMessage" class="text-danger mt-3">{{ errorMessage }}</p>
      </form>
      <div class="signup-link">
        <p>계정이 없으신가요? <router-link to="/signup">회원가입</router-link></p>
      </div>
    </div>
  </div>
</template>

<script>
// 기존 스크립트 코드 유지 (수정할 필요 없음)
import axios from 'axios';
import { mapActions } from 'vuex'; // Vuex 액션 매핑

export default {
  name: 'LoginView',
  data() {
    return {
      loginId: '',
      loginPassword: '',
      errorMessage: ''
    };
  },
  methods: {
    ...mapActions(['login']), // Vuex 스토어의 login 액션을 매핑

    async handleLogin() {
      this.errorMessage = ''; // 에러 메시지 초기화
      try {
        const response = await axios.post('http://localhost:8080/api/auth', {
          loginId: this.loginId,
          password: this.loginPassword
        });

        // 로그인 성공 시 Vuex 액션 호출 및 리다이렉트
        // 백엔드에서 jwt 토큰을 줌
        const { token } = response.data; 
        this.login({ token }); // Vuex에 로그인 상태 저장

        alert('로그인 성공!');
        this.$router.push('/');
      } catch (error) {
        console.error('로그인 실패:', error.response ? error.response.data : error.message);
        
        // ⭐ 이 부분을 수정합니다 ⭐
        if (error.response) {
          // 백엔드에서 보낸 에러 응답이 있을 경우
          if (error.response.data && error.response.data.message) {
            // 백엔드에서 'message' 필드를 포함하여 응답했을 때
            this.errorMessage = `로그인 실패: ${error.response.data.message}`;
          } else if (error.response.status === 401) {
            // 401 Unauthorized 상태 코드이지만, 특정 메시지가 없을 경우
            this.errorMessage = '로그인 실패: 아이디 또는 비밀번호를 확인해주세요.';
          } else if (error.response.status === 400) {
            // 400 Bad Request 등 클라이언트 요청 오류
            this.errorMessage = '로그인 실패: 잘못된 요청입니다.';
          } else if (error.response.status === 500) {
            // 500 Internal Server Error 등 서버 내부 오류
            this.errorMessage = '로그인 실패: 서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';
          } else {
            // 그 외 알 수 없는 HTTP 상태 코드
            this.errorMessage = `로그인 실패: 알 수 없는 오류 (${error.response.status}).`;
          }
        } else {
          // 서버 응답 자체가 없거나 네트워크 오류일 경우
          this.errorMessage = '로그인 실패: 네트워크 연결을 확인하거나 서버가 실행 중인지 확인해주세요.';
        }
      }
    }
  }
};
</script>

<style scoped>
/* 로그인 페이지 전체 컨테이너 */
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 100px); /* 푸터와 헤더를 제외한 화면 높이 */
  padding: 20px;
}

/* 로그인 폼 컨테이너 */
.login-container {
  background-color: white;
  border: 1px solid #7B2CBF; /* SignupView와 동일한 보라색 테두리 */
  border-radius: 15px; /* 둥근 모서리 */
  padding: 40px;
  width: 100%;
  max-width: 400px; /* 최대 너비 설정 */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05); /* 은은한 그림자 */
}

/* ⭐ '로그인' 타이틀 스타일 수정 (가운데 정렬) ⭐ */
.login-title {
  text-align: center; /* 가운데 정렬 */
  color: #3C096C; /* 진한 보라색 */
  margin-bottom: 30px;
  font-weight: bold;
}

/* 폼 그룹 (라벨 + 입력 필드) */
.form-group {
  margin-bottom: 20px;
}

.form-label {
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
  display: block;
}

.form-control {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 8px; /* 둥근 모서리 */
  box-sizing: border-box; /* 패딩이 너비에 포함되도록 */
}

.form-control:focus {
  border-color: #7B2CBF; /* 포커스 시 보라색 테두리 */
  box-shadow: 0 0 0 0.2rem rgba(123, 44, 191, 0.25);
}

/* ⭐ 로그인 버튼 스타일 수정 (색상 변경) ⭐ */
.login-btn {
  width: 100%;
  background-color: #3C096C; /* 어둡고 진한 보라색으로 변경 (SignupBtn과 통일감) */
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 10px; /* 둥근 모서리 */
  font-size: 1.1em;
  font-weight: bold;
  margin-top: 20px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.login-btn:hover {
  background-color: #2a074d; /* 호버 시 약간 더 어둡게 */
}

/* 에러 메시지 스타일 */
.text-danger {
  color: #dc3545;
  font-size: 0.85em;
  margin-top: 10px;
  text-align: center;
}

/* 회원가입 링크 스타일 */
.signup-link {
  text-align: center;
  margin-top: 20px;
  font-size: 0.95em;
  color: #555;
}

.signup-link a {
  color: #7B2CBF; /* 보라색 링크 */
  text-decoration: none;
  font-weight: bold;
}

.signup-link a:hover {
  text-decoration: underline;
}
</style>