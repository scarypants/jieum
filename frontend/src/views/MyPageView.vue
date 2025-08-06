<template>
  <div v-if="!me">loading...</div>
  <div v-if="me" class="mypage-container">
    <!-- 프로필 박스 -->
    <div class="profile-box">
      <img src="@/assets/user.png" alt="프로필 이미지" class="profile-image" />

      <div class="user-info">
        <div class="info-pill">
          <span class="label-pill">닉네임</span>
          <span class="info-text">{{ me.nickname }}</span>
        </div>
        <div class="info-pill">
          <span class="label-pill">아이디</span>
          <span class="info-text">{{ me.loginId }}</span>
        </div>
        <div class="info-pill">
          <span class="label-pill">비밀번호</span>
          <input disabled type="password" class="info-text" value="{{ me.password }}" >
        </div>

        <!-- 프로필 수정 & 회원 탈퇴 버튼 (우측 하단) -->
        <div class="profile-buttons">
          <button class="edit-button" @click="goToEdit">프로필 수정</button>
          <button class="delete-button">회원 탈퇴</button>
        </div>
      </div>
    </div>

    <!-- 스크랩 & 내 아이디어 탭 -->
    <div class="tab-select">
      |
      <span :class="{ active: selectedTab === 'mine' }" @click="selectedTab = 'mine'">내 아이디어</span>
      |
      <span :class="{ active: selectedTab === 'scrap' }" @click="selectedTab = 'scrap'">스크랩 아이디어</span>
      |
      <span v-if="this.me.role == 'admin'" :class="{ active: selectedTab === 'scrap' }" @click="selectedTab = 'scrap'">관리자 페이지</span>
    </div>

    <!-- 아이디어 목록 -->
    <div class="idea-grid">
      <div
        v-for="idea in filteredIdeas"
        :key="idea.idea.id"
        class="idea-card"
        @click="goToIdea(idea.idea.id)"
      >
        <div class="idea-header">
          <div class="idea-title with-bg">{{ idea.idea.title }}</div>
        </div>
        <div class="idea-content">
          {{ idea.idea.content }}
        </div>
        <div class="idea-footer">
          <div class="idea-meta">
            <span>조회수 {{ idea.idea.viewCount }}</span>
            <span>스크랩 {{ idea.idea.scrapCount }}</span>
            <span>댓글 {{ idea.idea.commentCount }}</span>
          </div>
          <div class="idea-author">
            <span>{{ idea.idea.date }}</span>
          </div>

          <!-- 내 아이디어에만 수정/삭제 버튼 노출 -->
          <div
            v-if="selectedTab === 'mine'"
            class="idea-actions"
          >
            <button class="edit-mini">수정</button>
            <button class="delete-mini" @click="deleteIdea(idea.idea.id)">삭제</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { authFetchAPI } from '@/components/appClient';
export default {
  name: 'MyPageView',
  data() {
    return {
      me: null,
      selectedTab: 'mine',
      scrapIdeas: [],
      myIdeas: []
    };
  },
  computed: {
    filteredIdeas() {
      return this.selectedTab === 'scrap' ? this.scrapIdeas : this.myIdeas;
    }
  },
  methods: {
    async fetchMe() {
      try {
        const response = await authFetchAPI.get('/users/me')
        this.me = response.data
      } catch (error) {
          this.error = error.message ?? '내 프로필 정보를 가져오는데 실패했습니다.'
      } 
    },
    async fetchScrap() {
      try {
        const response = await authFetchAPI.get('/scraps')
        this.scrapIdeas = response.data
      } catch (error) {
          this.error = error.message ?? '스크랩 목록를 가져오는데 실패했습니다.'
      }    
    },
    async fetchIdeas() {
      try {
        const response = await authFetchAPI.get('/ideas/me')
        this.myIdeas = response.data
      } catch (error) {
          this.error = error.message ?? '내 아이디어를 가져오는데 실패했습니다.'
      }
    },
    async deleteIdea(id) {
      try {
        await authFetchAPI.delete(`/ideas/${id}`)
        this.$router.push('/mypage')
      } catch (error) {
          this.error = error.message ?? '아이디어를 삭제할 수 없습니다.'
      }  
    },
    goToEdit() {
      this.$router.push('/profile-edit');
    },
    goToIdea(id) {
      this.$router.push(`/idea/${id}`);
    },
    // goToIdeaEdit(id) {
    //   this.$router.push(`/`)
    // },
    formatDate(date) {
      const d = new Date(date);
      return d.toLocaleDateString();
    }
  },
  async created() {
    await this.fetchMe();
    await this.fetchIdeas();
    await this.fetchScrap();
  }
};
</script>

<style scoped>
.mypage-container {
  background-color: white;
  padding: 60px 20px;
  max-width: 900px;
  margin: 0 auto;
}

/* ── 프로필 ── */
.profile-box {
  border: 2px solid #ccc;
  padding: 30px;
  display: flex;
  align-items: center;
  border-radius: 10px;
  margin-bottom: 30px;
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
  position: relative;
}
.info-pill {
  display: flex;
  align-items: center;
  background-color: rgba(227, 220, 234, 0.4);
  border: 2px solid #5C1E94;
  border-radius: 40px;
  max-width: 60%;
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
.info-text {
  font-size: 16px;
  color: #333;
  word-break: break-word;
}

/* 프로필 수정/탈퇴 버튼 */
.profile-buttons {
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
  gap: 10px;
}
.edit-button {
  padding: 6px 16px;
  border-radius: 20px;
  border: none;
  background-color: #E8D8F6;
  border: 2px solid #3C096C;
  color: #5C1E94;
  font-weight: bold;
  cursor: pointer;
}
.edit-button:hover {
  background-color: #dcc7f1;
}
.delete-button {
  padding: 6px 16px;
  border-radius: 20px;
  border: none;
  background-color: #ffebeb;
  border: 2px solid red;
  color: red;
  font-weight: bold;
  cursor: pointer;
}
.delete-button:hover {
  background-color: #ffdada;
}

/* ── 탭 선택 ── */
.tab-select {
  margin-bottom: 20px;
  font-weight: bold;
  font-size: 16px;
  color: #444;
}
.tab-select span {
  cursor: pointer;
  padding: 0 10px;
}
.tab-select .active {
  color: #5C1E94;
  text-decoration: underline;
}

/* ── 아이디어 카드 ── */
.idea-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}
.idea-card {
  background-color: #fff5c2;
  border: 1px solid #FFE97F;
  border-radius: 12px;
  padding: 20px;
  transition: 0.2s ease;
  cursor: pointer;
}
.idea-card:hover {
  transform: translateY(-4px);
}
.idea-title.with-bg {
  background-color: #FFE97F;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 18px;
  font-weight: bold;
}
.idea-content {
  margin-top: 10px;
  font-size: 14px;
  color: #444;
  height: 4.5em;
  overflow: hidden;
}
.idea-tags {
  margin-top: 8px;
  font-size: 13px;
  font-weight: bold;
}
.idea-meta {
  font-size: 12px;
  color: #888;
  display: flex;
  gap: 10px;
  margin-top: 6px;
}
.idea-author {
  font-size: 12px;
  color: #555;
  display: flex;
  justify-content: space-between;
  margin-top: 6px;
}
.idea-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
}
.edit-mini,
.delete-mini {
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 20px;
  border: none;
  cursor: pointer;
}
.edit-mini {
  background-color: #e8d8f6;
  color: #5C1E94;
}
.delete-mini {
  background-color: #ffe5e5;
  color: red;
}
</style>
