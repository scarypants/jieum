<template>
  <div class="profile-edit-container">
    <!-- 프로필 카드 UI 재사용 -->
    <div class="profile-box">
      <img src="@/assets/user.png" alt="프로필 이미지" class="profile-image" />

      <div class="user-info">
        <!-- 닉네임 수정 -->
        <div class="info-pill">
          <span class="label-pill">닉네임</span>
          <input v-model="nickname" class="info-input" />
        </div>

        <!-- 아이디 수정 -->
        <div class="info-pill">
          <span class="label-pill">아이디</span>
          <input v-model="loginId" class="info-input" />
        </div>

        <!-- 비밀번호 수정 -->
        <div class="info-pill">
          <span class="label-pill">비밀번호</span>
          <input placeholder="*******" v-model="password" type="password" class="info-input" />
        </div>
      </div>
    </div>

    <!-- 수정 완료 버튼 -->
    <div class="submit-area">
      <button class="submit-button" @click="saveProfile">수정 완료</button>
    </div>
  </div>
</template>

<script>
import { authFetchAPI } from '@/components/appClient';
export default {
  name: 'ProfileEditView',
  data() {
    return {
      error: null,
      id: null,
      nickname: null,
      loginId: null,
      password: null
    }
  },
  methods: {
    async fetchMe() {
      try {
        const response = await authFetchAPI.get('/users/me')
        this.id = response.data.id
        this.nickname = response.data.nickname
        this.loginId = response.data.loginId
        this.password = response.data.password
      } catch (error) {
        this.error = error.message ?? '내 프로필 정보를 가져오는데 실패했습니다.'
      } 
    },
    async saveProfile() {
      try {
        await authFetchAPI.patch(`/users/${this.id}`, {
          nickname: this.nickname,
          loginId: this.loginId,
          password: this.password
        })

        alert('수정이 완료되었습니다.');
        this.$router.push('/mypage');
      } catch (error) {
          this.error = error.message ?? '사용자 정보를 수정할 수 없습니다.'
      }
      
    }
  },
  async created() {
    await this.fetchMe();
  }
}
</script>

<style scoped>
.profile-edit-container {
  background-color: white;
  padding: 60px 20px;
  max-width: 900px;
  margin: 0 auto;
}

.profile-box {
  border: 2px solid #ccc;
  padding: 30px;
  display: flex;
  align-items: center;
  border-radius: 10px;
  margin-bottom: 40px;
}
.profile-image {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 30px;
}
.user-info {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.info-pill {
  display: flex;
  align-items: center;
  background-color: rgba(227, 220, 234, 0.4);
  border: 2px solid #5C1E94;
  border-radius: 40px;
  max-width: 70%;
  padding: 0;
  gap: 0;
}
.label-pill {
  background-color: #3C096C;
  border: 2px solid #3C096C;
  color: white;
  border-radius: 40px;
  padding: 10px 30px;
  font-weight: bold;
  white-space: nowrap;
  flex-shrink: 0;
  margin-right: 12px;
}
.info-input {
  flex-grow: 1;
  font-size: 16px;
  color: #333;
  background: transparent;
  border: none;
  outline: none;
  padding: 10px 5px;
}

/* 제출 버튼 */
.submit-area {
  display: flex;
  justify-content: flex-end;
}
.submit-button {
  background-color: #3C096C;
  border: none;
  border-radius: 30px;
  padding: 10px 25px;
  font-weight: bold;
  color: white;
  cursor: pointer;
  transition: 0.3s ease;
}
.submit-button:hover {
  opacity: 0.85;
}
</style>
