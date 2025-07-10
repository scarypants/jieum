<template>
  <div class="signup-page">
    <div class="signup-container">
      <h1 class="signup-title">회원가입</h1>
      <form @submit.prevent="handleSignUp" class="signup-form">
        <div class="form-group">
          <label for="signupId" class="form-label">아이디</label>
          <div class="input-with-button">
            <input 
              type="text" 
              class="form-control" 
              id="signupId" 
              v-model="signupId" 
              placeholder="영어/숫자만 가능" 
              required
              @input="validateId"
            >
            <button 
              type="button" 
              class="btn check-btn" 
              @click="checkIdDuplicate"
              :disabled="!isIdValid"
            >
              중복 체크
            </button>
          </div>
          <p v-if="idMessage" :class="idMessage.type === 'error' ? 'text-danger' : 'text-success'">
            {{ idMessage.text }}
          </p>
        </div>

        <div class="form-group">
          <label for="signupPassword" class="form-label">비밀번호</label>
          <input 
            type="password" 
            class="form-control" 
            id="signupPassword" 
            v-model="signupPassword" 
            placeholder="8자 이상" 
            required
            @input="validatePassword"
          >
          <p v-if="passwordMessage" :class="passwordMessage.type === 'error' ? 'text-danger' : 'text-success'">
            {{ passwordMessage.text }}
          </p>
        </div>

        <div class="form-group">
          <label for="nickname" class="form-label">닉네임</label>
          <div class="input-with-button">
            <input 
              type="text" 
              class="form-control" 
              id="nickname" 
              v-model="nickname" 
              required
              @input="validateNickname"
            >
            <button 
              type="button" 
              class="btn check-btn" 
              @click="checkNicknameDuplicate"
              :disabled="!isNicknameValid"
            >
              중복 체크
            </button>
          </div>
          <p v-if="nicknameMessage" :class="nicknameMessage.type === 'error' ? 'text-danger' : 'text-success'">
            {{ nicknameMessage.text }}
          </p>
        </div>

        <button type="submit" class="btn signup-btn" :disabled="!canSubmit">
          회원가입
        </button>
        <p v-if="errorMessage" class="text-danger mt-3">{{ errorMessage }}</p>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'; // API 요청을 위한 axios 임포트

export default {
  name: 'SignUpView', // 컴포넌트 이름 설정
  data() {
    return {
      // 입력 필드 데이터
      signupId: '',
      signupPassword: '',
      nickname: '',

      // 유효성 검사 및 중복 체크 메시지 상태
      // { text: '메시지 내용', type: 'error' | 'success' } 형식
      idMessage: null,
      passwordMessage: null,
      nicknameMessage: null,
      errorMessage: '',      // 전체 폼 제출 실패 시 표시될 메시지

      // 중복 체크 및 유효성 검사 완료 상태 플래그
      isIdAvailable: false,     // 아이디 중복 확인 완료 및 사용 가능 여부
      isNicknameAvailable: false, // 닉네임 중복 확인 완료 및 사용 가능 여부
      isIdValid: false,         // 아이디 형식 유효성 검사 통과 여부
      isPasswordValid: false,   // 비밀번호 형식 유효성 검사 통과 여부
      isNicknameValid: false,   // 닉네임 형식 유효성 검사 통과 여부
    };
  },
  computed: {
    // 모든 회원가입 조건을 만족해야 '회원가입' 버튼 활성화
    canSubmit() {
      return this.isIdValid && this.isIdAvailable &&
             this.isPasswordValid && 
             this.isNicknameValid && this.isNicknameAvailable;
    }
  },
  watch: {
    // 아이디 입력값이 변경되면 중복 체크 상태를 초기화
    signupId(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.isIdAvailable = false; // 아이디가 변경되면 중복 체크 다시 해야 함
        this.idMessage = null; // 메시지 초기화
      }
    },
    // 닉네임 입력값이 변경되면 중복 체크 상태를 초기화
    nickname(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.isNicknameAvailable = false; // 닉네임이 변경되면 중복 체크 다시 해야 함
        this.nicknameMessage = null; // 메시지 초기화
      }
    }
  },
  methods: {
    // 아이디 유효성 검사 로직
    validateId() {
      // 아이디는 영어/숫자만 허용하며, 최소 4자 이상이어야 함 (정규식 예시)
      const idRegex = /^[a-zA-Z0-9]{4,}$/; 
      if (!this.signupId) {
        this.idMessage = null; // 입력값이 없으면 메시지 숨김
        this.isIdValid = false;
      } else if (!idRegex.test(this.signupId)) {
        this.idMessage = { text: '아이디는 4자 이상의 영어/숫자만 가능합니다.', type: 'error' };
        this.isIdValid = false;
      } else {
        this.idMessage = { text: '아이디 형식 유효함.', type: 'success' };
        this.isIdValid = true;
      }
    },
    // 아이디 중복 체크 로직 (비동기 API 호출)
    async checkIdDuplicate() {
      if (!this.isIdValid) { // 아이디 형식이 유효하지 않으면 중복 체크를 막음
        alert('아이디 형식을 먼저 확인해주세요.');
        return;
      }
      try {
        // 백엔드 API (예: GET /api/users/check-loginId?loginId=...) 호출
        // response 변수 전체를 사용하지 않고, 필요한 data만 구조 분해 할당
        const { data } = await axios.get(`http://localhost:8080/api/users/check-loginId?loginId=${this.signupId}`);
        
        // 백엔드 응답 (예: { isAvailable: true } 또는 { isAvailable: false }) 에 따라 메시지 설정
        if (data.isAvailable) { 
          this.isIdAvailable = true;
          this.idMessage = { text: '사용 가능한 아이디입니다.', type: 'success' };
        } else {
          this.isIdAvailable = false;
          this.idMessage = { text: '이미 사용 중인 아이디입니다.', type: 'error' };
        }
      } catch (error) {
        // API 요청 실패 시 에러 처리 및 메시지 설정
        console.error('아이디 중복 체크 실패:', error.response ? error.response.data : error.message);
        this.idMessage = { text: '중복 체크 중 오류가 발생했습니다.', type: 'error' };
        this.isIdAvailable = false;
      }
    },

    // 비밀번호 유효성 검사 로직
    validatePassword() {
      // 비밀번호는 최소 8자 이상이어야 함 (예시)
      if (!this.signupPassword) {
        this.passwordMessage = null; // 입력값이 없으면 메시지 숨김
        this.isPasswordValid = false;
      } else if (this.signupPassword.length < 8) {
        this.passwordMessage = { text: '비밀번호는 8자 이상이어야 합니다.', type: 'error' };
        this.isPasswordValid = false;
      } else {
        this.passwordMessage = { text: '비밀번호 유효함.', type: 'success' };
        this.isPasswordValid = true;
      }
    },

    // 닉네임 유효성 검사 로직
    validateNickname() {
      // 닉네임은 최소 2자 이상이어야 함 (예시)
      if (!this.nickname) {
        this.nicknameMessage = null; // 입력값이 없으면 메시지 숨김
        this.isNicknameValid = false;
      } else if (this.nickname.length < 2) {
        this.nicknameMessage = { text: '닉네임은 2자 이상이어야 합니다.', type: 'error' };
        this.isNicknameValid = false;
      } else {
        this.nicknameMessage = { text: '닉네임 형식 유효함.', type: 'success' };
        this.isNicknameValid = true;
      }
    },
    // 닉네임 중복 체크 로직 (비동기 API 호출)
    async checkNicknameDuplicate() {
      if (!this.isNicknameValid) { // 닉네임 형식이 유효하지 않으면 중복 체크를 막음
        alert('닉네임 형식을 먼저 확인해주세요.');
        return;
      }
      try {
        // 백엔드 API (예: GET /api/users/check-nickname?nickname=...) 호출
        const { data } = await axios.get(`http://localhost:8080/api/users/check-nickname?nickname=${this.nickname}`);
        
        if (data.isAvailable) {
          this.isNicknameAvailable = true;
          this.nicknameMessage = { text: '사용 가능한 닉네임입니다.', type: 'success' };
        } else {
          this.isNicknameAvailable = false;
          this.nicknameMessage = { text: '이미 사용 중인 닉네임입니다.', type: 'error' };
        }
      } catch (error) {
        console.error('닉네임 중복 체크 실패:', error.response ? error.response.data : error.message);
        this.nicknameMessage = { text: '중복 체크 중 오류가 발생했습니다.', type: 'error' };
        this.isNicknameAvailable = false;
      }
    },

    // 회원가입 폼 제출 처리 로직 (비동기 API 호출)
    async handleSignUp() {
      this.errorMessage = ''; // 이전 에러 메시지 초기화

      // 최종적으로 모든 유효성 및 중복 체크가 완료되었는지 확인
      if (!this.canSubmit) {
        this.errorMessage = '모든 필드를 올바르게 입력하고 중복 체크를 완료해주세요.';
        return;
      }

      try {
        // 백엔드 회원가입 API 엔드포인트에 POST 요청
        // 응답 데이터가 필요 없으므로 'response' 변수에 할당하지 않아 ESLint 에러 방지
        await axios.post('http://localhost:8080/api/users', {
          loginId: this.signupId,
          password: this.signupPassword,
          nickname: this.nickname,
        });

        // 회원가입 성공 시 알림 및 로그인 페이지로 리다이렉트
        alert('회원가입이 성공적으로 완료되었습니다! 로그인 페이지로 이동합니다.');
        this.$router.push('/login'); 

      } catch (error) {
        // 회원가입 실패 시 에러 처리 및 메시지 표시
        console.error('회원가입 실패:', error.response ? error.response.data : error.message);
        if (error.response && error.response.data && error.response.data.message) {
          this.errorMessage = `회원가입 실패: ${error.response.data.message}`;
        } else {
          this.errorMessage = '회원가입 중 오류가 발생했습니다. 다시 시도해주세요.';
        }
      }
    },
  },
  // 컴포넌트가 마운트된 후 초기 유효성 검사 실행 (선택 사항)
  mounted() {
    this.validateId();
    this.validatePassword();
    this.validateNickname();
  }
};
</script>
<style scoped>
/* 회원가입 페이지 전체 컨테이너 */
.signup-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 100px); /* 푸터와 헤더를 제외한 화면 높이 */
  padding: 20px;
}

/* 회원가입 폼 컨테이너 */
.signup-container {
  background-color: white;
  border: 1px solid #7B2CBF; /* 보라색 테두리 */
  border-radius: 15px; /* 둥근 모서리 */
  padding: 40px;
  width: 100%;
  max-width: 500px; /* 최대 너비 설정 */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05); /* 은은한 그림자 */
}

.signup-title {
  text-align: center;
  color: #3C096C; /* 로고와 비슷한 진한 보라색 */
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
  display: block; /* 라벨이 한 줄 전체 차지하도록 */
}

/* 입력 필드와 중복 체크 버튼이 함께 있는 경우 */
.input-with-button {
  display: flex; /* input과 button을 한 줄에 정렬 */
  align-items: center;
}

.input-with-button .form-control {
  flex-grow: 1; /* input이 최대한 많은 공간 차지 */
  margin-right: 10px; /* 버튼과의 간격 */
  border-radius: 8px; /* 둥근 모서리 */
  border: 1px solid #ddd; /* 기본 테두리 */
  padding: 10px 15px;
}

/* 모든 input 요소의 포커스 스타일 */
.form-control:focus {
  border-color: #7B2CBF; /* 포커스 시 보라색 테두리 */
  box-shadow: 0 0 0 0.2rem rgba(123, 44, 191, 0.25); /* 보라색 그림자 효과 */
}

/* 중복 체크 버튼 */
.check-btn {
  background-color: #7B2CBF; /* 보라색 배경 */
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 8px; /* 둥근 모서리 */
  font-weight: bold;
  white-space: nowrap; /* 텍스트 줄바꿈 방지 */
  transition: background-color 0.2s ease;
}

.check-btn:hover:not(:disabled) {
  background-color: #5d229a; /* 호버 시 약간 어둡게 */
}

.check-btn:disabled {
  background-color: #cccccc; /* 비활성화 시 회색 */
  cursor: not-allowed;
}

/* 회원가입 제출 버튼 */
.signup-btn {
  width: 100%; /* 너비 100% */
  background-color: #3C096C; /* 진한 보라색 배경 */
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 10px; /* 둥근 모서리 */
  font-size: 1.1em;
  font-weight: bold;
  margin-top: 20px;
  transition: background-color 0.2s ease;
}

.signup-btn:hover:not(:disabled) {
  background-color: #2a074d; /* 호버 시 약간 어둡게 */
}

.signup-btn:disabled {
  background-color: #cccccc; /* 비활성화 시 회색 */
  cursor: not-allowed;
}

/* 유효성 검사 메시지 */
.text-danger {
  color: #dc3545; /* 빨간색 (에러 메시지) */
  font-size: 0.85em;
  margin-top: 5px;
}

.text-success {
  color: #28a745; /* 녹색 (성공 메시지) */
  font-size: 0.85em;
  margin-top: 5px;
}
</style>