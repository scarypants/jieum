<template>
  <div class="my-page">
    <h1>마이페이지</h1>
    <p v-if="currentUser">환영합니다, {{ currentUser.nickname }}님!</p>
    <p>여기에 사용자 정보를 보여주거나 수정하는 폼을 만드세요.</p>
    <p v-if="currentUser && currentUser.email">이메일: {{ currentUser.email }}</p>
    <p v-if="currentUser && currentUser.id">사용자 ID: {{ currentUser.id }}</p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'; // Vuex getter 헬퍼 임포트

export default {
  name: 'MyPageView',
  computed: {
    // Vuex의 'currentUser' getter를 이 컴포넌트의 속성으로 매핑
    ...mapGetters(['currentUser']) 
  }
};
</script>

<style scoped>
.my-page {
  padding: 50px;
  text-align: center;
  border: 1px solid #7B2CBF;
  border-radius: 8px;
  max-width: 600px;
  margin: 50px auto;
  padding: 30px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.05);
  background-color: white;
}
</style>