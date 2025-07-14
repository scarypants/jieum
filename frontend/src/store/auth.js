import { createStore } from 'vuex'

export default createStore({
  state: {
    isLoggedIn: false,
    user: null,        // 사용자 정보 (예: { id: 1, role: 'admin', nickname: '미소' })
    token: null,       // JWT 토큰
  },
  mutations: { //로그인 상태 설정 뮤테이션
    setLoginStatus(state, { isLoggedIn, user, token }) {
      state.isLoggedIn = isLoggedIn
      state.user = user
      state.token = token
      if (isLoggedIn) {
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
      } else {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    },
    clearLoginStatus(state) { //로그아웃 뮤테이션 - 로그인 상태 초기화 뮤테이션
      state.isLoggedIn = false
      state.user = null
      state.token = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  },
  actions: {
    // 로그인 성공 시 호출될 액션 : 백엔드에서 받은 사용자 정보와 토큰으로 상태 업데이트
    login({ commit }, { user, token }) {
      commit('setLoginStatus', { isLoggedIn: true, user, token })
    },
    // 로그아웃 시 호출될 액션
    logout({ commit }) {
      commit('clearLoginStatus')
    },
    // 앱 로드 시 로컬 스토리지에서 로그인 정보 복원
    initializeLoginStatus({ commit }) {
      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')
      if (token && user) {
        try {
          const user = JSON.parse(user)
          // JWT 유효성 검사 (선택 사항: 필요에 따라 서버에 유효성 검사 요청)
          commit('setLoginStatus', { isLoggedIn: true, user, token });
        } catch (e) {
          console.error("로컬 스토리지에서 사용자 정보 파싱 실패", e);
          commit('clearLoginStatus'); // 파싱 실패 시 로그인 상태 초기화
        }
      }
    }
  },
  getters: {
    // 로그인 상태 반환
    isLoggedIn: state => state.isLoggedIn, // 로그인 여부 확인
    currentUser: state => state.user, // 현재 로그인한 사용자 정보 반환
    authToken: state => state.token,// 현재 로그인한 사용자의 JWT 토큰 반환(인증 토큰)
  }
});