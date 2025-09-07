<template>
  <div v-if="!me">loading...</div>

  <div v-else class="mypage-container">
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
          <!-- input 기본 박스 제거 + Vue 바인딩 -->
          <input disabled type="password" class="info-text no-box" value="**********" />
        </div>

        <!-- 프로필 수정 & 회원 탈퇴 버튼 (우측 하단) -->
        <div class="profile-buttons">
          <button class="edit-button" @click="goToEdit">프로필 수정</button>
          <button class="delete-button" @click="confirmDeleteAccount">회원 탈퇴</button>
        </div>
      </div>
    </div>

    <!-- 탭: 내 아이디어 / 스크랩 아이디어 / 관리자 페이지(항상 표기하되 권한 체크는 클릭 시) -->
    <div class="tab-select">
      |
      <span :class="{ active: selectedTab === 'mine' }" @click="selectTab('mine')">내 아이디어</span>
      |
      <span :class="{ active: selectedTab === 'scrap' }" @click="selectTab('scrap')">스크랩 아이디어</span>
      |
      <span class="admin-link" @click="goAdmin">관리자 페이지</span>
      |
    </div>

    <!-- 내가 작성한 아이디어 -->
    <section v-if="selectedTab === 'mine'">
      <div class="idea-grid">
        <div
          v-for="idea in myIdeas"
          :key="idea.id"
          class="idea-card"
        >
          <div @click="goToIdea(idea.id)">
            <div class="idea-header">
              <div class="idea-title with-bg">{{ idea.title }}</div>
            </div>
            <div class="idea-content">
              {{ idea.content }}
            </div>
            <div class="idea-footer">
              <div class="idea-meta">
                <span>조회수 {{ idea.viewCount }}</span>
                <span>스크랩 {{ idea.scrapCount }}</span>
                <span>댓글 {{ idea.commentCount }}</span>
              </div>
              <div class="idea-author">
                <span>{{ formatDate(idea.createdAt) }}</span>
              </div>
            </div>
          </div>

          <!-- 내 아이디어에만 수정/삭제 버튼 -->
          <div class="idea-actions">
            <button class="edit-mini" @click.stop="goToEditIdea(idea.id)">수정</button>
            <button class="delete-mini" @click.stop="deleteIdea(idea.id)">삭제</button>
          </div>
        </div>
      </div>
    </section>

    <!-- 스크랩 아이디어 -->
    <section v-else>
      <div class="idea-grid">
        <div
          v-for="idea in scrapIdeas"
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
              <span>{{ formatDate(idea.idea.createdAt) }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 관리자 섹션 템플릿은 제거 (관리자 페이지는 별도 /admin 라우트에서 열기) -->
  </div>
</template>

<script>
import { fetchAPI, authFetchAPI } from '@/components/appClient';
import { mapActions } from 'vuex';

export default {
  name: 'MyPageView',
  data() {
    return {
      me: null,
      selectedTab: 'mine', // 'mine' | 'scrap'
      scrapIdeas: [],
      myIdeas: [],
      error: null
    };
  },
  methods: {
    ...mapActions(['logout']),

    async fetchMe() {
      try {
        const response = await authFetchAPI.get('/users/me');
        this.me = response.data;
      } catch (error) {
        this.error = error?.message ?? '내 프로필 정보를 가져오는데 실패했습니다.';
      }
    },
    async fetchScrap() {
      try {
        const response = await authFetchAPI.get('/scraps');
        this.scrapIdeas = response.data;
      } catch (error) {
        const status = error?.response?.status;
        if (status === 400 || status === 404) {
          // 목록 없음 → 정상 케이스로 간주
          this.scrapIdeas = [];
        } else {
          this.error = error?.message ?? '스크랩 목록를 가져오는데 실패했습니다.';
        }
      }
      
    },
    async fetchIdeas() {
      try {
        const response = await authFetchAPI.get('/ideas/me');
        this.myIdeas = response.data;
      } catch (error) {
        const status = error?.response?.status;
        if (status === 400 || status === 404) {
          // 목록 없음 → 정상 케이스로 간주
          this.myIdeas = [];
        } else {
          this.error = error?.message ?? '내 아이디어를 가져오는데 실패했습니다.';
        }
      }
    },
    async deleteIdea(id) {
      try {
        await authFetchAPI.delete(`/ideas/${id}`);
        // 삭제 후 내 아이디어 목록 갱신
        await this.fetchIdeas();
      } catch (error) {
        this.error = error?.message ?? '아이디어를 삭제할 수 없습니다.';
      }
    },
    goToEdit() {
      this.$router.push('/profile-edit');
    },
    async goToIdea(id) {
      try {
        await fetchAPI.patch(`/ideas/${id}/views`)
        this.$router.push(`/idea/${id}`);
      } catch (error) {
        this.error = '아이디어를 조회할 수 없습니다.'
      }
    },
    goToEditIdea(id) {
      this.$router.push(`/ideaedit/${id}`);    
    },
    selectTab(tab) {
      this.selectedTab = tab;
    },
    goAdmin() {
      // 관리자만 /admin 이동, 일반 회원은 팝업만 띄우고 이동하지 않음
      const role = this.me?.role;
      if (role === 'admin') {
        this.$router.push('/admin');
      } else {
        alert('관리자만 접근할 수 있습니다.');
        // 이동 없음
      }
    },
    async confirmDeleteAccount() {
      if (confirm('회원을 탈퇴하시겠습니까?')) {
        try {
          await authFetchAPI.post('/inquiries')
          alert('탈퇴 신청이 완료되었습니다.');
          // Vuex logout 액션 호출
          this.logout();
          // 로그아웃 후 홈 페이지로 리다이렉트 (현재 경로가 홈이 아니면)
          if (this.$route.path !== '/') {
            this.$router.push('/');
          }
        } catch (error) {
          this.error = '문의사항을 생성할 수 없습니다.'
        }
      }
    },
    formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleDateString();
    },
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
  position: relative;
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
.no-box {
  border: none;
  background: transparent;
  outline: none;
  box-shadow: none;
}

/* 프로필 수정/탈퇴 버튼 */
.profile-buttons {
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
  gap: 10px;
}
.edit-button { /* 프로필 수정 버튼 */
  padding: 6px 16px;
  border-radius: 20px;
  border: 2px solid #3C096C;
  background-color: #E8D8F6;
  color: #5C1E94;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s ease;
}
.edit-button:hover {
  background-color: #dcc7f1;
}
.delete-button {
  padding: 6px 16px;
  border-radius: 20px;
  border: 2px solid red;
  background-color: #ffebeb;
  color: red;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s ease;
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
.tab-select span,
.tab-select .admin-link {
  cursor: pointer;
  padding: 0 10px;
  text-decoration: none;
  color: inherit;
}
.tab-select .active {
  color: #5C1E94;
  text-decoration: underline;
}
.tab-disabled {
  color: #bbb;
  padding: 0 10px;
  cursor: not-allowed;
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
